module.exports = function(grunt) {
    var appConfig = grunt.file.readJSON('package.json');

    var pathsConfig = function(appName) {
        this.app = appName || appConfig.name;
        return {
            app: this.app,
            node_modules: 'node_modules',
            templates: 'templates',
            css: 'static/css',
            sass: 'static/sass',
            fonts: 'static/fonts',
            images: 'static/images',
            js: 'static/js',
            manageScript: 'manage.py'
        };
    };

    // load all grunt with given configuration
    // see: https://github.com/sindresorhus/load-grunt-tasks#all-options-in-use
    require('load-grunt-tasks')(grunt);

    // require it at the top and pass in the grunt instance
    // see: https://github.com/sindresorhus/time-grunt#usage
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: appConfig,
        paths: pathsConfig(),

        // see: https://github.com/gruntjs/grunt-contrib-clean#getting-started
        clean: {},

        // see: https://github.com/gruntjs/grunt-contrib-copy#usage-examples
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>/bootstrap-sass/assets/fonts/bootstrap/',
                        src: '*',
                        dest: '<%= paths.fonts %>/bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>/font-awesome/fonts/',
                        src: '*',
                        dest: '<%= paths.fonts %>/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>/bootstrap-sass/assets/fonts/bootstrap/',
                        src: '*',
                        dest: 'assets/fonts/bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.node_modules %>/font-awesome/fonts/',
                        src: '*',
                        dest: 'assets/fonts/'
                    }
                ]
            }
        },

        // see: https://github.com/sindresorhus/grunt-sass
        sass: {
            dev: {
                options: {
                    outputStyle: 'nested',
                    sourceMap: false,
                    precision: 10,
                    includePaths: [
                        '<%= paths.node_modules %>/bootstrap-sass/assets/stylesheets',
                        '<%= paths.node_modules %>/font-awesome/scss',
                    ]
                },
                files: {
                    '<%= paths.css %>/common.css': '<%= paths.sass %>/common.scss'
                },
            },
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceMap: false,
                    precision: 10,
                    includePaths: [
                        '<%= paths.node_modules %>/bootstrap-sass/assets/stylesheets',
                        '<%= paths.node_modules %>/font-awesome/scss',
                    ]
                },
                files: {
                    'assets/css/common.css': '<%= paths.sass %>/common.scss'
                },
            }
        },

        // see: https://github.com/nDmitry/grunt-postcss#usage
        postcss: {
            options: {
                map: true, // inline sourcemaps
                processors: [
                    // add fallbacks for rem units
                    // see: https://github.com/robwierzbowski/node-pixrem#usage
                    require('pixrem')(),

                    // select all browser versions that are the last version of each major browser
                    // or have a usage of over 10% in global usage statistics
                    // see: https://github.com/postcss/autoprefixer#grunt
                    // see: https://github.com/ai/browserslist#queries
                    require('autoprefixer')({browsers: 'last 2 versions, > 10%'}),

                    // minify the result
                    // see: http://cssnano.co/usage/
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'assets/css/*.css'
            }
        },

        // see: https://github.com/gruntjs/grunt-contrib-uglify#getting-started
        uglify: {
            dev: {
                options: {
                    beautify: true
                },
                files: {
                    '<%= paths.js %>/html5shiv.js': [
                        '<%= paths.node_modules %>/html5shiv/dist/html5shiv.js'
                    ],
                    '<%= paths.js %>/common.js': [
                        '<%= paths.node_modules %>/jquery/dist/jquery.js',
                        '<%= paths.node_modules %>/bootstrap-sass/assets/javascripts/bootstrap.js'
                    ]
                }
            },
            dist: {
                options: {
                    compress: true,
                },
                files: {
                    'assets/js/html5shiv.js': [
                        '<%= paths.node_modules %>/html5shiv/dist/html5shiv.js'
                    ],
                    'assets/js/common.js': [
                        '<%= paths.node_modules %>/jquery/dist/jquery.js',
                        '<%= paths.node_modules %>/bootstrap-sass/assets/javascripts/bootstrap.js'
                    ]
                }
            }
        },

        // see: https://github.com/gruntjs/grunt-contrib-watch#getting-started
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            uglify: {
                files: ['<%= paths.js %>/**/*.js'],
                tasks: ['uglify:dev'],
                options: {
                    atBegin: true
                }
            },
            sass: {
                files: ['<%= paths.sass %>/**/*.{scss,sass}'],
                tasks: ['sass:dev'],
                options: {
                    atBegin: true
                }
            },
            copy: {
                files: ['<%= paths.fonts %>/'],
                tasks: ['copy:dev'],
                options: {
                    atBegin: true
                }
            }
        },

        // see: https://npmjs.org/package/grunt-bg-shell
        bgShell: {
            _defaults: {
                bg: true
            },
            runDjango: {
                cmd: 'python <%= paths.manageScript %> runserver 0.0.0.0:8000'
            }
        }
    });

    grunt.registerTask('serve', [
        'bgShell:runDjango',
        'watch'
    ]);

    grunt.registerTask('build', [
        'uglify:dist',
        'sass:dist',
        'postcss',
        'copy:dist'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
