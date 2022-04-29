//обьявляем плагины
const { src, dest, series, watch } = require('gulp');
//const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
//const svgSprite = require('gulp-svg-sprite');
const tiny = require('gulp-tinypng-compress');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
//на будущее
//const include = require('gulp-file-include');


//tasks
// const styles = () => {
//     return src('src/styles/**/*.scss')
//     .pipe(sourcemaps.init())
//     .pipe(concat('main.scss'))
//     .pipe(browserSync.stream())
//     .pipe(sourcemaps.write())
//     .pipe(dest('dist'))
// };

// const stylesBuild = () => {
//     return src('src/styles/**/*.scss')
//     .pipe(concat('main.scss'))
//     .pipe(autoprefixer({
//         cascade: false,
//     }))
//     .pipe(cleanCSS({
//         level: 2,
//     }))
//     .pipe(browserSync.stream())
//     .pipe(dest('dist'))
// }

//для сборки хтмл страниц не забыть добавить вотчинг и экспорт
//cоздадим хтмл страницы с футером и хэдером для подключения в различные хтмл страницы)
// const html = () => {
//     return src('src/**/*.html')
//     .pipe(include({
//         prefix: '@'
//     }))
//     .pipe(browserSync.stream())
//     .pipe(dest('dist'))
// }

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(browserSync.stream())
    .pipe(dest('dist'))
};

const htmlBuild = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(browserSync.stream())
    .pipe(dest('dist'))
}

//для обработки scss файлов, на будущее) не забыть добавить вотчинг и экспорт
const scss = () => {
  return src('src/styles/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(dest('dist/styles'))
    .pipe(browserSync.stream())
}

// const svgSprites = () => {
//     return src('src/images/svg/**/*.svg')
//     .pipe(svgSprite({
//         mode: {
//             stack: {
//                 sprite: '../sprite.svg',
//             },
//         }
//     }))
//     .pipe(dest('dist/images'))
// }

const imageToDist = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/*.svg',
    'src/images/**/*.jpeg'
  ])
    // .pipe(image())
    .pipe(dest('dist/images'))
}

const tinypng = () => {
  return src([
    'src/images/**/*.jpg',
    'src/images/**/*.png',
    'src/images/*.svg',
    'src/images/**/*.jpeg'
  ])
    .pipe(tiny({
      key: '3stk2whGskpwhpt5H46zVNy4cG6LmV6T',
    }))
    .pipe(dest('dist/images'))
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(webpackStream({
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(browserSync.stream())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/components'))
}

const scriptsBuild = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(webpackStream({
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist/resources'))
}

const clear = () => {
  return del(['dist'])
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
};



watch('src/**/*.html', htmlMinify);
watch('src/**/*.scss', scss);
// watch('src/**/*.css', styles);
watch('src/images/**/*.jpg', imageToDist);
watch('src/images/**/*.jpeg', imageToDist);
watch('src/images/**/*.png', imageToDist);
watch('src/images/**/*.svg', imageToDist);
//watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);
watch('src/js/**/*.js', scriptsBuild);


exports.default = series(clear, htmlMinify, scss, scripts, imageToDist, resources, watchFiles)
exports.build = series(clear, htmlBuild, scss, scriptsBuild, resources, tinypng)
