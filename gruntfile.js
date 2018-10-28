module.exports = function( grunt ) {

 	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        concat: {
      		options: {
        		separator: '\n\n',
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: Velocity Apps is application and controllers library for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
      		},
      		dist: {
        		src: [	
					'src/apps/core/base.js', 'src/apps/core/controllers/**/*.js', 'src/apps/core/services/**/*.js', 'src/apps/core/**/*.js',
					'src/apps/forms/base.js', 'src/apps/forms/controllers/**/*.js', 'src/apps/forms/**/*.js',
					'src/apps/notify/base.js', 'src/apps/notify/controllers/**/*.js', 'src/apps/notify/**/*.js',
				],
        		dest: 'dist/velocity-apps.js'
      		}
    	},
    	uglify: {
			options: {
				banner: '/**\n * <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
			            '\n * Description: Velocity Apps is application and controllers library for CMSGears.' +
			            '\n * License: <%= pkg.license %>' +
			            '\n * Author: <%= pkg.author %>' +
			            '\n */\n\n'
			},
      		main_target: {
	        	files: {
	          		'dist/velocity-apps.min.js': [ 'dist/velocity-apps.js' ]
	        	}
      		}
    	}
    });

    grunt.registerTask( 'default', [ 'concat', 'uglify' ] );
};
