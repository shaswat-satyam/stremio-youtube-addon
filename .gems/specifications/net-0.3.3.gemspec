# -*- encoding: utf-8 -*-
# stub: net 0.3.3 ruby lib

Gem::Specification.new do |s|
  s.name = "net".freeze
  s.version = "0.3.3".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Jeremy Cohen Hoffing".freeze, "Claudio Baccigalupo".freeze]
  s.date = "2015-09-03"
  s.description = "Retrieves information for Twitter users".freeze
  s.email = ["jcohenhoffing@gmail.com".freeze, "claudio@fullscreen.net".freeze]
  s.homepage = "https://github.com/Fullscreen/net".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.4.5".freeze
  s.summary = "An API Client for social networks".freeze

  s.installed_by_version = "3.7.2".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<activesupport>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<bundler>.freeze, ["~> 1.6".freeze])
  s.add_development_dependency(%q<rake>.freeze, ["~> 10.3".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3.1".freeze])
  s.add_development_dependency(%q<yard>.freeze, ["~> 0.8.7".freeze])
  s.add_development_dependency(%q<coveralls>.freeze, ["~> 0.7.1".freeze])
  s.add_development_dependency(%q<vcr>.freeze, ["~> 2.9".freeze])
  s.add_development_dependency(%q<webmock>.freeze, ["~> 1.19".freeze])
end
