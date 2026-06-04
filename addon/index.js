const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
require("dotenv").config();

const BaseAPIurl = process.env.BaseAPIurl;
const LocalAPIurl = "https://stremio-youtube-addon-1m3b.onrender.com/api/v1";

const manifest = {
  id: "org.stremio.youtube-media",
  name: "Youtube Media",
  version: "1.0.0",
  description: "Watch Youtube Media available on youtube",
  resources: ["catalog", "stream", "meta"],
  types: ["movie", "series", "tv"],
  catalogs: [
    { type: "movie", id: "Youtube" },
    { type: "series", id: "Youtube" },
    { type: "tv", id: "Youtube" },
  ],
  idPrefixes: ["tt", "youtube-tv-channel-"],
};

const builder = new addonBuilder(manifest);

const METAHUB_URL = "https://images.metahub.space";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?\/]+)/);
  return match ? match[1] : null;
}

function generateMetaPreview(imdb_id, name, type, poster) {
  if (type == "tv") {
    return { id: imdb_id, type, name };
  }
  return {
    id: imdb_id.split(":")[0],
    type,
    name,
    poster: poster || METAHUB_URL + "/poster/medium/" + imdb_id + "/img",
  };
}

// ─── Database Fetchers ────────────────────────────────────────────────────────

async function getStreamsFromDatabase(type) {
  let response;
  try {
    if (type == "movie") {
      response = await fetch(`${LocalAPIurl}/movies`);
    } else if (type == "series") {
      response = await fetch(`${LocalAPIurl}/shows`);
    } else if (type == "tv") {
      response = await fetch(`${BaseAPIurl}/tv`);
    }

    if (!response.ok) {
      console.error("Failed to fetch streams:", response.statusText);
      return [];
    }

    const result = await response.json();

    if (type == "movie") {
      return result.map((r) => ({
        imdb_id: r.imdb_id,
        name: r.title,
        poster: r.poster_url,
        youtube_link: r.youtube_link,
        is_embeddable: r.is_embeddable,
      }));
    }

    if (type == "series") {
      return result.map((r) => ({
        imdb_id: r.imdb_id,
        name: r.title,
        poster: r.poster_url,
      }));
    }

    if (type == "tv") {
      return result.data.map((r) => ({
        id: r.id,
        name: r.name,
        poster: r.poster || "https://www.lifeinabreakdown.com/wp-content/uploads/2023/01/older-television-on-spindly-legs-with-large-dials-image-licensed-via-canva-pro-and-copyright-via-Getty-Images-Signature-and-shaunl.jpg",
        type: "tv",
      }));
    }
  } catch (err) {
    console.error("getStreamsFromDatabase error:", err);
    return [];
  }

  return [];
}

async function getStreamsFromDatabaseForParticularId(id, type) {
  let response;
  try {
    if (type == "movie") {
      response = await fetch(`${LocalAPIurl}/movies/${id}`);
      if (!response.ok) {
        console.error("Failed to fetch movie:", response.statusText);
        return [];
      }
      const r = await response.json();
      return [{
        id: String(r.id),
        title: r.title,
        imdb_id: r.imdb_id,
        youtube_link: r.youtube_link,
        youtube_id: extractYoutubeId(r.youtube_link),
        is_embeddable: r.is_embeddable,
        poster: r.poster_url,
      }];

    } else if (type == "series") {
      response = await fetch(`${LocalAPIurl}/shows/${id}`);
      if (!response.ok) {
        console.error("Failed to fetch series:", response.statusText);
        return [];
      }
      const r = await response.json();
      return [{
        id: String(r.id),
        title: r.title,
        imdb_id: r.imdb_id,
        poster: r.poster_url,
        seasons: (r.seasons || []).map((season) => ({
          season_number: season.season_number,
          imdb_id: season.imdb_id,
          youtube_playlist_link: season.youtube_playlist_link,
          episodes: (season.episodes || []).map((ep) => ({
            episode_number: ep.episode_number,
            imdb_id: ep.imdb_id,
            youtube_link: ep.youtube_link,
            youtube_id: extractYoutubeId(ep.youtube_link),
            is_embeddable: ep.is_embeddable,
          })),
        })),
      }];

    } else if (type == "tv") {
      response = await fetch(`${BaseAPIurl}/tv/${id.split("-").at(-1)}`);
      if (!response.ok) {
        console.error("Failed to fetch tv:", response.statusText);
        return [];
      }
      const result = await response.json();
      return {
        id,
        title: result.data.title,
        name: result.data.name,
        youtube_id: result.data.youtube_id,
      };
    }
  } catch (err) {
    console.error("getStreamsFromDatabaseForParticularId error:", err);
    return [];
  }

  return [];
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

builder.defineMetaHandler(async ({ id, type }) => {
  return {
    meta: { id, type, name: id },
  };
});

builder.defineCatalogHandler(async (args) => {
  const result = await getStreamsFromDatabase(args.type);
  let metas = [];

  if (result.length > 0) {
    if (args.type == "tv") {
      metas = result.map(({ id, name, poster }) =>
        generateMetaPreview("youtube-tv-channel-" + id, name, args.type, poster)
      );
    } else {
      metas = result.map(({ imdb_id, name, poster }) =>
        generateMetaPreview(imdb_id, name, args.type, poster)
      );
    }
  }

  return { metas };
});

builder.defineStreamHandler(async ({ id, type }) => {

  if (type == "tv") {
    const stream = await getStreamsFromDatabaseForParticularId(id, type);
    return {
      streams: [{
        id,
        title: stream.title || stream.name || "Live TV",
        ytId: stream.youtube_id,
        type: "tv",
        url: "https://abplivetv.akamaized.net/hls/live/2043010/hindi/master.m3u8",
        behaviorHints: { notWebReady: true, isLive: true },
      }],
    };
  }

  const streamsFromDB = await getStreamsFromDatabaseForParticularId(id, type);

  if (!Array.isArray(streamsFromDB) || streamsFromDB.length === 0) {
    return { streams: [] };
  }

  if (type == "movie") {
    const streams = streamsFromDB.map((stream) => ({
      id: stream.id,
      title: stream.title || "Watch on Youtube",
      ytId: stream.youtube_id,
      type,
    }));
    return { streams };
  }

  if (type == "series") {
    // id format from stremio: tt1234567:1:2 (imdb_id:season:episode)
    const [imdb_id, seasonNum, episodeNum] = id.split(":");
    const show = streamsFromDB[0];
    const season = (show.seasons || []).find(
      (s) => String(s.season_number) === String(seasonNum)
    );
    const episode = season
      ? (season.episodes || []).find(
          (e) => String(e.episode_number) === String(episodeNum)
        )
      : null;

    if (!episode) {
      console.error("Episode not found:", seasonNum, episodeNum);
      return { streams: [] };
    }

    return {
      streams: [{
        id,
        title: `S${seasonNum}E${episodeNum} on Youtube`,
        ytId: episode.youtube_id,
        type,
      }],
    };
  }

  return { streams: [] };
});

serveHTTP(builder.getInterface(), { port: 7001 });
