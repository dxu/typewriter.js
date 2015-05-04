module.exports = function(grunt) {
  grunt.initConfig({
    broccoli: {
      dist: {
        dest: 'dist'
      }
    }
  })

  grunt.loadNpmTasks('grunt-broccoli')

  grunt.registerTask('default', 'watch')
  grunt.registerTask('watch', ['broccoli:dist:watch'])
  grunt.registerTask('build', ['broccoli:dist:build'])
  grunt.registerTask('serve', ['broccoli:dist:serve'])
}
