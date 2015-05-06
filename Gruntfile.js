module.exports = function(grunt) {
  grunt.initConfig({
    broccoli: {
      client: {
        dest: 'dist',
        config: 'brocfiles/client.js'
      },
      src: {
        dest: 'lib',
        config: 'brocfiles/src.js'
      }
    }
  })

  grunt.loadNpmTasks('grunt-broccoli')

  grunt.registerTask('default', 'watch')
  grunt.registerTask('watch', ['broccoli:src:watch'])
  grunt.registerTask('build', ['broccoli:src:build'])
  grunt.registerTask('serve', ['broccoli:src:serve'])

  grunt.registerTask('clientw', ['broccoli:client:watch'])
  grunt.registerTask('clientb', ['broccoli:client:build'])
  grunt.registerTask('clients', ['broccoli:client:serve'])
}
