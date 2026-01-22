{
  description = "This is a flake to Setup Development environment for the project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-25.05";
  };

  outputs = { self, nixpkgs, ... }: let
    system = "x86_64-linux";
    pkgs =  import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [ 
        dioxus-cli
        cargo
        rustc 
        rustfmt
        rustPackages.clippy
        pre-commit
      ];
      shellHook = '' 
       echo "Staring the Dev Env"
       di -v
       cargo -v
      '';
    };
  };
}