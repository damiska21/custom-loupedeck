{ pkgs, ... }:

{
  packages = [ 
    pkgs.nodejs_24
   ];
  enterShell = ''
    # Python pro node-gyp
    export PYTHON=$(which python3)

    # Node global path
    export PATH=$PATH:${pkgs.nodejs}/bin

    echo "Welcome to Loupedeck CT dev shell"
  '';
}
