/*
 Copyright (c) 2014, Intel Corporation

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 * Neither the name of Intel Corporation nor the names of its contributors
 may be used to endorse or promote products derived from this software
 without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

module.exports = function(grunt) {
    // Project configuration.
    var buildID = grunt.option('buildID') || 'local';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            jshint: 'buildscripts/jshint',
            jsfiles: ['Gruntfile.js',
                      'lib/**/*.js',
                      'api/**/*.js',
                      'admin/**/*.js',
                      'listeners/**/*.js']
        },
        license_finder: {
            default_options: {
                options: {
                    production: false,
                    directory: process.cwd(),
                    csv: true,
                    out: 'licenses.csv'
                }
            },
            production : {
                options: {
                    production: true,
                    directory: process.cwd(),
                    csv: true,
                    out: 'licenses_production.csv'
                }
            }
        },
        jshint: {
			options: {
				jshintrc: '<%= dirs.jshint %>/config.json',
				ignores: ['lib/deprected/*.js']
			},
			local: {
				src: ['<%= dirs.jsfiles %>'],
				options: {
					force: true
				}
			},
			teamcity: {
				src: ['<%= dirs.jsfiles %>'],
				options: {
					force: true,
					reporter: require('jshint-teamcity')
				}
			}
		},
        compress: {
            teamcity: {
                options: {
                    archive: 'dist/'+'<%= pkg.name %>_' + buildID + ".tgz",
                    mode: 'tgz'
                },
                files: [{cwd: '.',
                        expand: true,
                         src: ['**/*.js', '**/*.sh', 'config.json', '!node_modules/**', '!dist/**', '!test/**', '!Gruntfile.js'],
                        /* this is the root folder of untar file */
                         dest: '<%= pkg.name %>/'
                        }
                    ]
                }
            },
        mocha_istanbul: {
           local: {
               src: 'test/', // the folder, not the files
               options: {
                   ui: 'bdd',
                   coverage: true,
                   recursive: true,
                   reporter: 'list',
                   timeout: 20000,
                   mask: '*Tests.js',
                   check: {
                    lines: 66,
                    statements: 66,
                    function: 70
                    },
                   root: '.', // define where the cover task should consider the root of libraries that are covered by tests
                   coverageFolder: 'dist/coverage',
                   reportFormats: ['lcov']
               }
           },
           teamcity: {
                src: 'test/', // the folder, not the files
                options: {
                    ui: 'bdd',
                    coverage: true,
                    recursive: true,
                    reporter: 'mocha-teamcity-reporter',
                    timeout: 20000,
                    mask: '*Tests.js',
                    /*check: {
                        lines: 70,
                        statements: 70,
                        function: 70
                    },*/
                    root: '.', // define where the cover task should consider the root of libraries that are covered by tests
                    coverageFolder: 'dist/coverage',
                    reportFormats: ['lcov', 'teamcity']
                }
            }
        }
    });

    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below
        done();
    });

    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-license-finder');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task(s).
    grunt.registerTask('default', ['jshint:local', 'mocha_istanbul:local']);

    grunt.registerTask('teamcity_codevalidation', ['jshint:teamcity',
                                                   'mocha_istanbul:teamcity']);
    grunt.registerTask('packaging', ['compress:teamcity']);
};

