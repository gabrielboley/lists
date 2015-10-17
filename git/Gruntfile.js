module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

        handlebars: {
            compile: {
                options: {
                    namespace: 'Handlebars.templates',
                    processName: function(filePath) {
                        var pieces = filePath.split('src/js/templates/');
                        return pieces[pieces.length - 1].split('.')[0];
                    }
                },
                files: {
                    'src/js/templates/templates.js': 'src/js/templates/*.hbs'
                }
            }
        },

        browserify: {
            dist: {
                src: ['src/js/modules/*.js', 'src/js/modules/**/*.js', 'src/js/init.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        concat: {
            dist: {
                src: ['src/js/helpers/*.js', 'src/js/templates/*.js', 'src/js/polyfills', '<%= browserify.dist.dest %>'],
                dest: '<%= browserify.dist.dest %>'
            }
        },

		copy: {
			main: {
				files: [{
					src: '<%= concat.dist.dest %>',
					dest: 'dist/js/<%= pkg.name %>.<%= pkg.js.version %>.js'
				}]
			}
		},

		uglify: {
			my_target: {
				files: {
					'dist/js/<%= pkg.name %>.<%= pkg.js.version %>.min.js' : ['<%= concat.dist.dest %>']
				}
			}
		},

		jshint: {

		    files: 'src/js/modules/*.js',
		    options: {
				ignores: ['src/js/modules/scrollable.js'],
		    	curly: false,
		    	eqeqeq: false,
		    	eqnull: true,
		    	browser: true,
		    	asi: true,
		    	'-W065': true,
		    	'-W069': true,
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
		  	}
		},

        less: {
            css: {
                src: ['src/less/base.less'],
                dest: 'dist/css/<%= pkg.name %>.<%= pkg.css.version %>.css'
            },
            cssMin: {
                src: '<%= less.css.src %>',
                dest: 'dist/css/<%= pkg.name %>.<%= pkg.css.version %>.min.css',
                options: {
                    compress: true
                }
            }
        },

		watch: {
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['js']
            },
            less: {
                files: ['src/less/**/*.less','src/less/**/*.css'],
                tasks: ['css']
            }
		},

        shell: {
            getMd5Js: {
                command: 'node ./node_modules/getmd5/getmd5.js dist/js/<%= pkg.name %>.<%= pkg.js.version %>.min.js'
            },
            getMd5Less: {
                command: 'node ./node_modules/getmd5/getmd5.js dist/css/<%= pkg.name %>.<%= pkg.css.version %>.min.css'
            }
        }
    });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-browserify');



	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['js', 'css']);
    grunt.registerTask('js', ['handlebars', 'browserify', 'concat', 'copy', 'uglify', 'shell:getMd5Js']);
    grunt.registerTask('css', ['less', 'shell:getMd5Less']);

}