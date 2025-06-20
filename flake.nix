{
  description = "A Nix flake for running the web-p2p-tunnel CLI";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # This section defines how to build the web-p2p-tunnel Go program.
        # It's not in nixpkgs, so we build it from the source in this repository.
        webP2pTunnelPackage = pkgs.buildGoModule {
          pname = "web-p2p-tunnel";
          version = "latest";

          # 'src' points to the root of the flake's repository.
          src = self;

          # 'subPackages' specifies which Go package inside the repo to build.
          subPackages = [ "cmd/web-p2p-tunnel" ];

          # Nix needs a hash of the Go dependencies to ensure a reproducible build.
          # To get this hash, first use a placeholder like this:
          # vendorHash = pkgs.lib.fakeSha256;
          # Then, run 'nix build .#web-p2p-tunnel'. The build will fail and print the correct hash.
          # Replace the placeholder with the correct hash.
          vendorHash = "sha256-QkHxkFo2y5aQVf2g2Nf8PQuzAyV3NqfGsoL979ch2x8=";

          # Go binaries are statically linked by default, making them portable
          # across different Linux distributions like Alpine.
        };

      in
      {
        # 'packages' define what can be built or installed.
        packages = {
          # A user-friendly wrapper script for running the tunnel CLI.
          # This becomes the default package.
          default = pkgs.writeShellScriptBin "run-web-p2p-tunnel" ''
            #!${pkgs.stdenv.shell}
            echo "### Starting web-p2p-tunnel ###"

            # Check if at least one argument is provided.
            if [ $# -eq 0 ]; then
                echo "ERROR: Please provide the required arguments." >&2
                echo "Usage: nix run . -- -tunnel-target-url http://localhost:8080"
                exit 1
            fi

            echo "Forwarding to local server with arguments: $@"
            
            # Execute the actual binary from the built package.
            # It automatically adds the public signaling server for convenience.
            exec ${webP2pTunnelPackage}/bin/web-p2p-tunnel -signaling-server-url https://signal.andrewt.io "$@"
          '';

          # Expose the raw, unwrapped Go binary as well.
          web-p2p-tunnel = webP2pTunnelPackage;
        };

        # 'apps' allow running packages directly with 'nix run'.
        apps = {
          default = {
            type = "app";
            program = "${self.packages.${system}.default}/bin/run-web-p2p-tunnel";
          };
        };

        # The defaultApp is what runs when you execute 'nix run' without specifying an app.
        defaultApp = self.apps.${system}.default;

        # 'devShells' define development environments.
        devShells.default = pkgs.mkShell {
          name = "web-p2p-tunnel-dev-shell";
          
          # The tools needed for development, as mentioned in the original repository's documentation.
          buildInputs = [
            webP2pTunnelPackage # Include the built package in the shell
            pkgs.go             # The Go compiler and tools
            pkgs.nodejs         # For running npm commands in the 'web' directory
          ];

          shellHook = ''
            echo "### web-p2p-tunnel Development Shell ###"
            echo "The 'web-p2p-tunnel' executable is available in your PATH."
            echo "The Go toolchain and Node.js are also available."
            echo "To work on the web interface, cd into the 'web' directory and run 'npm install'."
          '';
        };

        # Standard formatter for Nix code. Run with 'nix fmt'.
        formatter = pkgs.nixpkgs-fmt;
      }
    );
}