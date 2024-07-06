{
  "targets": [
    {
      "target_name": "fast",
      "sources": ["./c/fast.c"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "cflags": ["-std=c11"],
      "link_settings": {
        "libraries": []
      }
    },
    {
      "target_name": "superFast",
      "sources": ["./c/superFast.c"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "cflags": ["-std=c11"],
      "link_settings": {
        "libraries": []
      }
    },
    {
      "target_name": "fastSIMD",
      "sources": ["./c/fastSIMD.c"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "cflags": [
        "-std=c11",
        "-mfpu=neon",
        "-mavx2"
      ],
      "link_settings": {
        "libraries": []
      }
    }
  ]
}
