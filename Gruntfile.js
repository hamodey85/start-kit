module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: ['path/*'],
                        dest: 'dest/',
                        filter: 'isFile'
                    },
                    // includes files within path and its sub-directories
                    {
                        expand: true,
                        src: ['path/**'],
                        dest: 'dest/'
                    },
                    // makes all src relative to cwd
                    {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                    // flattens results to a single level
                    {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ],
            },
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            js: {
                src: ['src/js/main.js',
                    'src/js/file2.js',
                    'src/js/file3.js',
                ],
                dest: 'js/js.js'
            },
            css: {
                src: ['src/css/bootstrap.css',
                    'src/css/file2.css',
                    'src/css/file3.css',
                    'src/css/main.css'
                ],
                dest: 'public/css/style.css'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                beautify: true,
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            public: {
                files: {
                    'public/js/main.min.js': 'public/js/main.js'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'release/css',
                    ext: '.min.css'
                }]
            }
        },
        //Minify images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/'
                }]
            }
        },
        htmlmin: {
            public: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'public/index.html': 'src/index.html', // 'destination': 'source'
                    'public/contact.html': 'src/contact.html'
                }
            },
            dev: { // Another target
                files: {
                    'public/index.html': 'src/index.html',
                    'public/contact.html': 'src/contact.html'
                }
            }
        },
        //SASS compile SASS TO css
        sass: {
            options: {
                style: 'expanded',
                sourcemap:"none",
                //debugInfo:true,
                update: false, // only compile changed files
                noCache: false,
                cacheLocation: '.sass-cache'
            },
            public: {
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['main.scss'],
                    dest: 'src/css',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'public/css/maps/' // ...to the specified directory
                },
                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'public/css/*.css'
            }
        },
        //Watch
        watch: {
            options: {
                livereload: true
            },
            // copy:{
            //     files: ['src/index.html','src/js/*.js','src/js/**/*.js'],
            //     tasks: ['copy'],
            // },
            sass: {
                // We watch and compile sass files as normal but don't live reload here
                files: ['src/scss/main.scss','src/scss/**/*.scss'],
                tasks: ['sass'],
            },
            livereload: {
                files: ['src/*.html'],
            },
        },
        // Connect server
        connect: {
            server: {
                options: {
                    hostname:"localhost",
                    open: true,
                    livereload: true,
                    base: 'src/'
                }
            }
        },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask(
        "dev", [
            "connect",
            "watch"
        ]);

};
