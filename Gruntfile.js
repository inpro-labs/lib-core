module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      dist: ['dist'],
    },
    shell: {
      build: {
        command: 'npm run build',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['clean', 'shell:build']);
};
