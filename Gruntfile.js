/*!
 * Bootstrap's Gruntfile
 * https://getbootstrap.com/
 * Copyright 2013-2019 Twitter, Inc.
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
  var generateGlyphiconsData = require('./grunt/bs-glyphicons-data-generator.js');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var getLessVarsData = function () {
    var filePath = path.join(__dirname, 'less/variables.less');
    var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    var parser = new BsLessdocParser(fileContent);
    return { sections: parser.parseFile() };
  };
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');
  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
      ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
      ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
      ' * Licensed under the <%= pkg.license %> license\n' +
      ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'package.js', 'grunt/*.js']
      },
      core: {
        src: 'js/*.js'
      },
      test: {
        options: {
          jshintrc: 'js/tests/unit/.jshintrc'
        },
        src: 'js/tests/unit/*.js'
      },
      assets: {
        src: ['docs/assets/js/src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
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
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      core: {
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
          'js/affix.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: true,
        mangle: true,
        ie8: true,
        output: {
          comments: /^!|@preserve|@license|@cc_on/i
        }
      },
      core: {
        src: '<%= concat.core.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        src: configBridge.paths.customizerJs,
        dest: 'docs/assets/js/customize.min.js'
      },
      docs: {
        src: configBridge.paths.docsJs,
        dest: 'docs/assets/js/docs.min.js'
      }
    },

    less: {
      options: {
        ieCompat: true,
        strictMath: true,
        sourceMap: true,
        outputSourceFiles: true
      },
      compileKSP: {
        options: {
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/ksp.less',
        dest: 'dist/css/ksp/<%= pkg.name %>.css'
      },
      compileFKS: {
        options: {
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/fks.less',
        dest: 'dist/css/fks/<%= pkg.name %>.css'
      },
      compileTrojsten: {
        options: {
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/trojsten.less',
        dest: 'dist/css/trojsten/<%= pkg.name %>.css'
      },
      compileKMS: {
        options: {
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/kms.less',
        dest: 'dist/css/kms/<%= pkg.name %>.css'
      },
      compileSUSI: {
        options: {
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/susi.less',
        dest: 'dist/css/susi/<%= pkg.name %>.css'
      },
    },

    postcss: {
      options: {
        map: {
          inline: false,
          sourcesContent: true
        },
        processors: [
          require('autoprefixer')(configBridge.config.autoprefixer)
        ]
      },
      fks: {
        src: 'dist/css/fks/<%= pkg.name %>.css'
      },
      ksp: {
        src: 'dist/css/ksp/<%= pkg.name %>.css'
      },
      trojsten: {
        src: 'dist/css/trojsten/<%= pkg.name %>.css'
      },
      kms: {
        src: 'dist/css/kms/<%= pkg.name %>.css'
      },
      susi: {
        src: 'dist/css/susi/<%= pkg.name %>.css'
      },
      docs: {
        src: 'docs/assets/css/docs.css'
      },
      examples: {
        options: {
          map: false
        },
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      }
    },

    stylelint: {
      options: {
        configFile: 'grunt/.stylelintrc',
        reportNeedlessDisables: false
      },
      dist: [
        'less/**/*.less'
      ],
      docs: [
        'docs/assets/less/**/*.less'
      ],
      examples: [
        'docs/examples/**/*.css'
      ]
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        sourceMap: true,
        sourceMapInlineSources: true,
        level: {
          1: {
            specialComments: 'all'
          }
        }
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
        src: 'docs/assets/css/docs.css',
        dest: 'docs/assets/css/docs.min.css'
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/**',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: 'dist/',
        src: [
          '**/*'
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
      options: {
        bundleExec: true,
        config: '_config.yml',
        incremental: false
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    pug: {
      options: {
        pretty: true,
        data: getLessVarsData
      },
      customizerVars: {
        src: 'docs/_pug/customizer-variables.pug',
        dest: 'docs/_includes/customizer-variables.html'
      },
      customizerNav: {
        src: 'docs/_pug/customizer-nav.pug',
        dest: 'docs/_includes/nav/customize.html'
      }
    },

    htmllint: {
      options: {
        ignore: [
          'Element "img" is missing required attribute "src".'
        ],
        noLangDetect: true
      },
      src: ['_gh_pages/**/*.html', 'js/tests/**/*.html']
    },

    watch: {
      src: {
        files: '<%= jshint.core.src %>',
        tasks: ['jshint:core', 'exec:karma', 'concat']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'exec:karma']
      },
      less: {
        files: 'less/**/*.less',
        tasks: ['less', 'copy']
      },
      docs: {
        files: 'docs/assets/less/**/*.less',
        tasks: ['less']
      }
    },

    exec: {
      browserstack: {
        command: 'cross-env BROWSER=true karma start grunt/karma.conf.js'
      },
      karma: {
        command: 'karma start grunt/karma.conf.js'
      }
    }
  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll:docs', 'htmllint']);

  var runSubset = function (subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function (val) {
    return typeof val === 'undefined' || val !== '0';
  };

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (runSubset('core')) {
    testSubtasks = testSubtasks.concat(['dist-css', 'dist-js', 'stylelint:dist', 'test-js', 'docs']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') &&
    // Skip HTML5 validator on Travis when [skip validator] is in the commit message
    isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }
  // Only run BrowserStack tests if there's a BrowserStack access key
  if (typeof process.env.BROWSER_STACK_USERNAME !== 'undefined' &&
    // Skip BrowserStack if running a different subset of the test suite
    runSubset('browserstack') &&
    // Skip BrowserStack on Travis when [skip browserstack] is in the commit message
    isUndefOrNonZero(process.env.TWBS_DO_BROWSERSTACK)) {
    testSubtasks.push('exec:browserstack');
  }

  grunt.registerTask('test', testSubtasks);
  grunt.registerTask('test-js', ['jshint:core', 'jshint:test', 'jshint:grunt', 'jscs:core', 'jscs:test', 'jscs:grunt', 'exec:karma']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core', 'commonjs']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileFKS', 'less:compileKSP', 'less:compileTrojsten', 'less:compileKMS', 'less:compileSUSI']);
  grunt.registerTask('dist-css', ['less-compile', 'postcss:ksp', 'postcss:fks', 'postcss:trojsten', 'postcss:kms', 'postcss:susi', 'cssmin:minifyKSP', 'cssmin:minifyFKS', 'cssmin:minifyTrojsten', 'cssmin:minifyKMS', 'cssmin:minifySUSI']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist',
    'dist-css',
    'copy:fonts',
    'dist-js',
    'copy:js',
    'copy:font',
    'copy:fks',
    'copy:ksp',
    'copy:kms',
    'copy:susi',
    'copy:trojsten'
  ]);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'copy:fonts', 'test']);

  grunt.registerTask('build-glyphicons-data', function () {
    generateGlyphiconsData.call(this, grunt);
  });

  // task for building customizer
  grunt.registerTask('build-customizer', ['build-customizer-html', 'build-raw-files']);
  grunt.registerTask('build-customizer-html', 'pug');
  grunt.registerTask('build-raw-files', 'Add scripts/less files to customizer.', function () {
    var banner = grunt.template.process('<%= banner %>');
    generateRawFiles(grunt, banner);
  });

  grunt.registerTask('commonjs', 'Generate CommonJS entrypoint module in dist dir.', function () {
    var srcFiles = grunt.config.get('concat.core.src');
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

  // Docs task.
  grunt.registerTask('docs-css', ['less:docs', 'less:docsIe', 'postcss:docs', 'postcss:examples', 'cssmin:docs']);
  grunt.registerTask('lint-docs-css', ['stylelint:docs', 'stylelint:examples']);
  grunt.registerTask('docs-js', ['uglify:docs', 'uglify:customize']);
  grunt.registerTask('lint-docs-js', ['jshint:assets', 'jscs:assets']);
  grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs', 'build-glyphicons-data', 'build-customizer']);

  grunt.registerTask('prep-release', ['dist', 'docs', 'jekyll:github']);
};
