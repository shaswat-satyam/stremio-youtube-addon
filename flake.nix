{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }: let
    pkgs = nixpkgs.legacyPackages.x86_64-linux;
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        ruby_3_3
        bundler
        nodejs
        yarn
        postgresql
        libxml2
        libxslt
        zlib
        openssl
        pkg-config
        libyaml
      ];
      shellHook = ''
        export GEM_HOME=$PWD/.gems
        export PATH=$GEM_HOME/bin:$PATH
        export BUNDLE_PATH=$PWD/.gems
      '';
    };
  };
}
