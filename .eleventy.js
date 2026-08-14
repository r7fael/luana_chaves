module.exports = function (eleventyConfig) {
  // style.css, script.js, imgs/ e videos/ ficam na raiz do site publicado,
  // exatamente como estão hoje - passthrough copy, sem processamento.
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("imgs");
  eleventyConfig.addPassthroughCopy("videos");

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  // No-op na build real do Eleventy - existe só pra marcar, nos templates,
  // quais valores são editáveis. O painel Editoria roda esses MESMOS
  // templates com uma implementação diferente desse filtro (que envolve o
  // valor num <span data-editoria-path="...">) pra saber o que destacar na
  // prévia ao vivo. Aqui na build de produção não altera o HTML em nada.
  eleventyConfig.addFilter("editable", (value) => value);

  // Linhas de crédito (infoRows) podem ter valor em string única ou array de linhas (equivalente ao <br> do HTML original).
  eleventyConfig.addFilter("renderValue", (value) => {
    if (Array.isArray(value)) return value.join(" <br>\n");
    return value;
  });

  // Agrupa imagens da galeria em blocos [{ type: "full", images: [x] } | { type: "duo", images: [x,y] }]
  // a partir do campo width ("full"|"half") de cada imagem, respeitando a curadoria manual existente.
  eleventyConfig.addFilter("galleryBlocks", (images) => {
    const blocks = [];
    let i = 0;
    while (i < images.length) {
      const img = images[i];
      if (img.width === "half" && images[i + 1] && images[i + 1].width === "half") {
        blocks.push({ type: "duo", images: [img, images[i + 1]] });
        i += 2;
      } else {
        blocks.push({ type: "full", images: [img] });
        i += 1;
      }
    }
    return blocks;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
