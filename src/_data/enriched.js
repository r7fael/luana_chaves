const siteConfig = require("../../site.config.json");

function titleCase(str) {
  return str.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function computeCategories() {
  const categories = [];
  const allProjects = [];

  siteConfig.collections.forEach((col) => {
    // Coleções "menu" (e outros tipos futuros fora do padrão categoria/grupo/
    // projeto) têm formato próprio e não entram na navegação em cadeia -
    // são carregadas separadamente (ver src/_data/menu.js).
    if (col.type) return;

    const groups = require(`./site/${col.file}`);

    groups.forEach((group) => {
      group.projects.forEach((project, i) => {
        const prevSlug = i === 0 ? null : group.projects[i - 1].slug;
        const nextSlug = i === group.projects.length - 1 ? null : group.projects[i + 1].slug;
        allProjects.push({
          ...project,
          groupSlug: group.slug,
          groupName: group.groupName,
          categorySlug: col.id,
          categoryLabel: col.label,
          categoryMeta: project.categoryMeta || { pt: titleCase(col.label.pt), en: titleCase(col.label.en) },
          prevHref: prevSlug ? `${prevSlug}.html` : "index.html",
          nextHref: nextSlug ? `${nextSlug}.html` : "index.html",
        });
      });
    });

    // Itens exibidos na página de índice da categoria: quando o grupo tem nome
    // (subcategoria, ex. design-grafico), vira 1 entrada só, apontando para o
    // primeiro projeto. Quando não tem nome (ex. direcao-criativa), cada projeto
    // do grupo vira sua própria entrada na lista, mesmo compartilhando a mesma
    // cadeia de prev/next.
    const listItems = [];
    groups.forEach((g) => {
      if (g.groupName) {
        const label = g.listLabel ? { pt: g.listLabel, en: g.listLabel } : g.groupName;
        listItems.push({
          slug: g.slug,
          href: `${g.projects[0].slug}.html`,
          previewImage: g.previewImage || g.projects[0].images[0].src,
          listLabel: label,
        });
      } else {
        g.projects.forEach((project) => {
          const label = project.listLabel
            ? { pt: project.listLabel, en: project.listLabel }
            : { pt: project.subtitle.toUpperCase(), en: project.subtitle.toUpperCase() };
          listItems.push({
            slug: project.slug,
            href: `${project.slug}.html`,
            previewImage: project.images[0].src,
            listLabel: label,
          });
        });
      }
    });

    categories.push({
      slug: col.id,
      label: col.label,
      titleLabel: col.titleLabel,
      groups: listItems,
    });
  });

  return { categories, allProjects };
}

module.exports = computeCategories();
