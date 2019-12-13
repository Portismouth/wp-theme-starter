import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify'
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json'
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;
const PROXY_URL = 'ADD PROXY URL HERE';

const paths = {
  styles: {
    src: [
      'src/assets/sass/bundle.scss',
    ],
    dest: 'dist/assets/css'
  },
  images: {
    src: 'src/assets/images/**/*.{jpeg,jpg,png,svg,gif}',
    dest: 'dist/assets/images'
  },
  other: {
    src: [
      'src/assets/**/*',
      '!src/assets/{images,js,sass}',
      '!src/assets/{images,js,sass}/**/*'
    ],
    dest: 'dist/assets'
  },
  scripts: {
    src: [
      'src/assets/js/bundle.js',
    ],
    dest: 'dist/assets/js'
  },
  package: {
    src: ['**/*',
      '!.vscode',
      '!node_modules{,/**}',
      '!packaged{,/**}',
      '!src{,/**}',
      '!.babelrc',
      '!.gitignore',
      '!gulpfile.babel.js',
      '!package.json',
      '!package-lock.json'],
    dest: 'packaged'
  }
}

export const serve = (cb) => {
  server.init({
    proxy: PROXY_URL,
    online: true
  });
  cb();
}

export const reload = (cb) => {
  server.reload();
  cb();
}

export const clean = () => {
  return del(['dist']);
}

export const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(PRODUCTION, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpIf(PRODUCTION, postcss([ autoprefixer() ])))
    .pipe(gulpIf(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

export const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulpIf(PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest));
}

export const copy = () => {
  return gulp
    .src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest));
}

export const watch = () => {
  gulp.watch('src/assets/sass/**/*.scss', gulp.series(styles));
  gulp.watch('src/assets/js/**/*.js', gulp.series(scripts, reload));
  gulp.watch('**/*.php', reload);
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.other.src, gulp.series(copy, reload));
}

export const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      output: {
        filename: '[name].js'
      },
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      mode: PRODUCTION ? 'production' : 'development',
      externals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(gulpIf(PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.scripts.dest));
}

export const compress = () => {
  return gulp.src(paths.package.src)
    .pipe(replace('_themename', info.name)) //name of theme in package.json
    .pipe(zip(`${info.name}.zip`))
    .pipe(gulp.dest(paths.package.dest));
}

export const dev = gulp.series(clean, gulp.parallel(styles, scripts, images, copy), serve, watch);
export const build = gulp.series(clean, gulp.parallel(styles, scripts, images, copy));
export const bundle = gulp.series(build, compress);

export default dev;