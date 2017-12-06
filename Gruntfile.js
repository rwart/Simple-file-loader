module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jsdoc: {
        dist: {
            src: ['README.md', 'index.js', 'modules/*.js'],
            options: {
                destination: 'doc',
              },
          },
      },
    jshint: {
      all: ['index.js', 'modules/*.js', 'Gruntfile.js'],
    },
    watch: {
      scripts: {
          files: ['README.md', 'index.js', 'modules/*.js'],
          tasks: ['jshint', 'jsdoc'],
          options: {
              spawn: false,
            },
        },
    },
    browserSync: {
        dev: {
            bsFiles: {
                src: ['doc/*.html'],
              },
            options: {
                watchTask: true,
                server: './doc', // server: true for baseDir: "./" Default - port: 3000
              },
          },
      },
  });

  // Load the plugins tasks
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browser-sync');

  // 'npm run watch" runs task watch for jshint, jsdoc
  grunt.registerTask('wait', ['browserSync', 'watch']);

  // 'npm run doc" runs task jsdoc
  grunt.registerTask('doc', ['jsdoc']);

  // "npm test" runs these task(s)
  grunt.registerTask('test', ['jshint']);

  // Default task(s).
  grunt.registerTask('default', ['test']);
};
