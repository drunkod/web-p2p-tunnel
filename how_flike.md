

### How to Use This Flake

1.  **Save the File**: Place the code above into a file named `flake.nix` in the root directory of the `web-p2p-tunnel` project clone.

2.  **Enable Flakes**: If you haven't already, you need to enable Nix Flakes. Add the following lines to your `nix.conf` file (usually at `~/.config/nix/nix.conf` or `/etc/nix/nix.conf`):
    ```
    experimental-features = nix-command flakes
    ```

3.  **Run the Tunnel (Usage)**:
    Start your local web server (e.g., on port 8080). Then, from the root of the project directory, run the `web-p2p-tunnel` CLI using Nix. All arguments after `--` are passed directly to the program.

    ```sh
    # Example: Tunneling to a local server at http://localhost:8080
    nix run . -- -tunnel-target-url http://localhost:8080
    ```
    The flake automatically uses the public signaling server `https://signal.andrewt.io`.

4.  **Enter the Development Environment**:
    To get a shell with `go`, `npm`, and the `web-p2p-tunnel` binary in your `PATH`, run:

    ```sh
    nix develop
    ```
    Inside this shell, you can work on the project as usual.

This `flake.nix` provides a complete, reproducible environment for both using and developing the `web-p2p-tunnel` project, leveraging the power and portability of Nix.