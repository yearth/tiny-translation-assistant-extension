// // 构建 shadow-dom.css 文件的脚本
// import fs from 'fs';
// import path from 'path';
// import postcss from 'postcss';
// import tailwind from '@tailwindcss/postcss';
// import autoprefixer from 'autoprefixer';

// async function buildCss() {
//   try {
//     // 读取源文件
//     const srcCssPath = path.resolve('./src/content/shadow-dom.css');
//     const srcCss = fs.readFileSync(srcCssPath, 'utf8');

//     console.log('正在处理 shadow-dom.css...');

//     // 使用 PostCSS 处理 CSS
//     const result = await postcss([tailwind, autoprefixer])
//       .process(srcCss, {
//         from: srcCssPath,
//         to: path.resolve('./dist/shadow-dom.css')
//       });

//     // 确保 dist 目录存在
//     if (!fs.existsSync('./dist')) {
//       fs.mkdirSync('./dist', { recursive: true });
//     }

//     // 写入处理后的 CSS
//     fs.writeFileSync(path.resolve('./dist/shadow-dom.css'), result.css);
//     console.log('shadow-dom.css 文件已成功生成！');
//   } catch (error) {
//     console.error('生成 CSS 时出错:', error);
//     process.exit(1);
//   }
// }

// buildCss();
