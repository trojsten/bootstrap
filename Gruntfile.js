/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var npmShrinkwrap = require('npm-shrinkwrap');
  var generateGlyphiconsData = require('./grunt/bs-glyphicons-data-generator.js');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
      ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
      ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
      ' */\n',
    // NOTE: This jqueryCheck code is duplicated in customizer.js; if making changes here, be sure to update the other copy too.
    jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\') }\n\n',

    // Task configuration.
    clean: {
      dist: ['dist', 'docs/dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      src: {
        src: 'js/*.js'
      },
      test: {
        options: {
          jshintrc: 'js/tests/unit/.jshintrc'
        },
        src: 'js/tests/unit/*.js'
      },
      assets: {
        src: ['docs/assets/js/_src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      src: {
        src: '<%= jshint.src.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: '<%= jshint.assets.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js',
          'js/offcanvas.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      bootstrap: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        src: [
          'docs/assets/js/_vendor/less.min.js',
          'docs/assets/js/_vendor/jszip.min.js',
          'docs/assets/js/_vendor/uglify.min.js',
          'docs/assets/js/_vendor/blob.js',
          'docs/assets/js/_vendor/filesaver.js',
          'docs/assets/js/raw-files.min.js',
          'docs/assets/js/_src/customizer.js'
        ],
        dest: 'docs/assets/js/customize.min.js'
      },
      docsJs: {
        src: [
          'docs/assets/js/_vendor/holder.js',
          'docs/assets/js/_vendor/ZeroClipboard.min.js',
          'docs/assets/js/_src/application.js'
        ],
        dest: 'docs/assets/js/docs.min.js'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },

    less: {
      compileKSP: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/ksp.less',
        dest: 'dist/css/ksp/<%= pkg.name %>.css'
      },
      compileFKS: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/fks.less',
        dest: 'dist/css/fks/<%= pkg.name %>.css'
      },
      compileTrojsten: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/trojsten.less',
        dest: 'dist/css/trojsten/<%= pkg.name %>.css'
      },
      compileKMS: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/kms.less',
        dest: 'dist/css/kms/<%= pkg.name %>.css'
      },
      compileSUSI: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/susi.less',
        dest: 'dist/css/susi/<%= pkg.name %>.css'
      },
    },

    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      fks: {
        options: {
          map: true
        },
        src: 'dist/css/fks/<%= pkg.name %>.css'
      },
      ksp: {
        options: {
          map: true
        },
        src: 'dist/css/ksp/<%= pkg.name %>.css'
      },
      trojsten: {
        options: {
          map: true
        },
        src: 'dist/css/trojsten/<%= pkg.name %>.css'
      },
      kms: {
        options: {
          map: true
        },
        src: 'dist/css/kms/<%= pkg.name %>.css'
      },
      susi: {
        options: {
          map: true
        },
        src: 'dist/css/susi/<%= pkg.name %>.css'
      },
      docs: {
        src: 'docs/assets/css/_src/docs.css'
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      src: [
        'dist/css/bootstrap.css',
        'dist/css/bootstrap-theme.css'
      ],
      examples: [
        'docs/examples/**/*.css'
      ],
      docs: {
        options: {
          ids: false,
          'overqualified-elements': false
        },
        src: 'docs/assets/css/_src/docs.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      minifyKSP: {
        src: 'dist/css/ksp/<%= pkg.name %>.css',
        dest: 'dist/css/ksp/<%= pkg.name %>.min.css'
      },
      minifyFKS: {
        src: 'dist/css/fks/<%= pkg.name %>.css',
        dest: 'dist/css/fks/<%= pkg.name %>.min.css'
      },
      minifyTrojsten: {
        src: 'dist/css/trojsten/<%= pkg.name %>.css',
        dest: 'dist/css/trojsten/<%= pkg.name %>.min.css'
      },
      minifyKMS: {
        src: 'dist/css/kms/<%= pkg.name %>.css',
        dest: 'dist/css/kms/<%= pkg.name %>.min.css'
      },
      minifySUSI: {
        src: 'dist/css/susi/<%= pkg.name %>.css',
        dest: 'dist/css/susi/<%= pkg.name %>.min.css'
      },
      docs: {
        src: [
          'docs/assets/css/_src/docs.css',
          'docs/assets/css/_src/pygments-manni.css'
        ],
        dest: 'docs/assets/css/docs.min.css'
      }
    },

    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: 'dist/css/*.css'
      }
    },

    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: '**/*.css',
        dest: 'docs/examples/'
      },
      docs: {
        files: {
          'docs/assets/css/_src/docs.css': 'docs/assets/css/_src/docs.css'
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: './dist',
        src: [
          '{css,js}/*.min.*',
          'css/*.map',
          'fonts/*'
        ],
        dest: 'docs/dist'
      },
      js: {
        expand: true,
        cwd: 'dist/js/',
        src: '**',
        dest: '../../trojsten/static/js/'
      },
      font: {
        expand: true,
        cwd: 'dist/fonts/',
        src: '**',
        dest: '../../trojsten/static/fonts/'
      },
      ksp: {
        expand: true,
        cwd: 'dist/css/ksp/',
        src: '**',
        dest: '../../trojsten/static/css/ksp/'
      },
      fks: {
        expand: true,
        cwd: 'dist/css/fks/',
        src: '**',
        dest: '../../trojsten/static/css/fks/'
      },
      kms: {
        expand: true,
        cwd: 'dist/css/kms/',
        src: '**',
        dest: '../../trojsten/static/css/kms/'
      },
      susi: {
        expand: true,
        cwd: 'dist/css/susi/',
        src: '**',
        dest: '../../trojsten/static/css/susi/'
      },
      trojsten: {
        expand: true,
        cwd: 'dist/css/trojsten/',
        src: '**',
        dest: '../../trojsten/static/css/trojsten/'
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      docs: {}
    },

    jade: {
      compile: {
        options: {
          pretty: true,
          data: function () {
            var filePath = path.join(__dirname, 'less/variables.less');
            var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
            var parser = new BsLessdocParser(fileContent);
            return { sections: parser.parseFile() };
          }
        },
        files: {
          'docs/_includes/customizer-variables.html': 'docs/_jade/customizer-variables.jade',
          'docs/_includes/nav/customize.html': 'docs/_jade/customizer-nav.jade'
        }
      }
    },

    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
          'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
          'Element img is missing required attribute src.'
        ]
      },
      files: {
        src: '_gh_pages/**/*.html'
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      less: {
        files: 'less/*.less',
        tasks: 'less'
      }
    },

    sed: {
      versionNumber: {
        pattern: (function () {
          var old = grunt.option('oldver');
          return old ? RegExp.quote(old) : old;
        })(),
        replacement: grunt.option('newver'),
        recursive: true
      }
    },

    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 10,
          maxRetries: 3,
          urls: ['http://127.0.0.1:3000/js/tests/index.html'],
          browsers: grunt.file.readYAML('grunt/sauce_browsers.yml')
        }
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  var runSubset = function (subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function (val) {
    return val === undefined || val !== '0';
  };

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (runSubset('core')) {
    testSubtasks = testSubtasks.concat(['dist-css', 'csslint', 'jshint', 'jscs', 'qunit', 'build-customizer-html']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') &&
    // Skip HTML5 validator on Travis when [skip validator] is in the commit message
    isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' &&
    // Skip Sauce if running a different subset of the test suite
    runSubset('sauce-js-unit') &&
    // Skip Sauce on Travis when [skip sauce] is in the commit message
    isUndefOrNonZero(process.env.TWBS_DO_SAUCE)) {
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileFKS', 'less:compileKSP', 'less:compileTrojsten', 'less:compileKMS', 'less:compileSUSI']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:ksp', 'autoprefixer:fks', 'autoprefixer:trojsten', 'autoprefixer:kms', 'autoprefixer:susi', 'usebanner', 'csscomb:dist', 'cssmin:minifyKSP', 'cssmin:minifyFKS', 'cssmin:minifyTrojsten', 'cssmin:minifyKMS', 'cssmin:minifySUSI']);

  // Docs distribution task.
  grunt.registerTask('dist-docs', 'copy:docs');

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist',
    'dist-css',
    'copy:fonts',
    'dist-js',
    'dist-docs',
    'copy:js',
    'copy:font',
    'copy:fks',
    'copy:ksp',
    'copy:kms',
    'copy:susi',
    'copy:trojsten'
  ]);

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'build-glyphicons-data', 'build-customizer']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', 'sed');

  grunt.registerTask('build-glyphicons-data', function () { generateGlyphiconsData.call(this, grunt); });

  // task for building customizer
  grunt.registerTask('build-customizer', ['build-customizer-html', 'build-raw-files']);
  grunt.registerTask('build-customizer-html', 'jade');
  grunt.registerTask('build-raw-files', 'Add scripts/less files to customizer.', function () {
    var banner = grunt.template.process('<%= banner %>');
    generateRawFiles(grunt, banner);
  });

  // Task for updating the cached npm packages used by the Travis build (which are controlled by test-infra/npm-shrinkwrap.json).
  // This task should be run and the updated file should be committed whenever Bootstrap's dependencies change.
  grunt.registerTask('update-shrinkwrap', ['exec:npmUpdate', '_update-shrinkwrap']);
  grunt.registerTask('_update-shrinkwrap', function () {
    var done = this.async();
    npmShrinkwrap({ dev: true, dirname: __dirname }, function (err) {
      if (err) {
        grunt.fail.warn(err)
      }
      var dest = 'test-infra/npm-shrinkwrap.json';
      fs.renameSync('npm-shrinkwrap.json', dest);
      grunt.log.writeln('File ' + dest.cyan + ' updated.');
      done();
    });
  });
};
