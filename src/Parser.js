import showdown from "showdown";
import juice from "juice";
import yaml from "js-yaml";
import mustache from "mustache";
import showdownHighlight from "showdown-highlight";

import PathUtils from "./utils/PathUtils.js";

const extensions = await PathUtils.loadExtensions("./content/resources/extensions/**.js")

export default class Parser {

    constructor(options) {

        this.options = options;

        this.converter = new showdown.Converter({
            ghCompatibleHeaderId: true,
            tables: true,
            metadata: true,
            parseImgDimensions: true,
            extensions: [...extensions, showdownHighlight]
        });

        this.cssMap = PathUtils.readFolder('./content/resources/styles/**.**');
        this.templateMap = PathUtils.readFolder('./content/resources/templates/**.**');
        this.partialsMap = PathUtils.readFolder('./content/resources/templates/partials/**.**');
    }

    applyTemplate({ metadata }) {

        const { template, view } = metadata;

        const { content } = this.templateMap.get(template);

        const partials = Object.fromEntries(
            [...this.partialsMap].map(([, v]) => [v.name, v.content])
        );

        const rendered = mustache.render(content, view, partials);

        return this.makeHtml(rendered).html;
    }

    applyCSS(html, styles = []) {

        const cssContents = styles.map(style => {
            const css = this.cssMap.get(style);
            if (!css) throw new Error(`${style} not found`);
            return css.content;
        });

        const rawHtml = `<style>${cssContents.join("\n")}</style>${html}`;

        return juice(rawHtml, {
            preserveMediaQueries: false,
            removeStyleTags: true,
            preserveFontFaces: false
        });
    }

    parse(path) {

        const view = {
            courseId: this.options.canvasCourseId
        };

        const files = PathUtils.readFolder(path);

        for (const file of files.values()) {

            const rendered = mustache.render(file.content, view);

            Object.assign(file, this.makeHtml(rendered));

            const { styles, template } = file.metadata;

            if (template) {
                file.html = this.applyTemplate(file);
            }

            file.html = this.applyCSS(file.html, styles);
        }

        return files;
    }

    makeHtml(stringAsMarkdown) {

        const html = this.converter.makeHtml(stringAsMarkdown);
        const rawMetadata = this.converter.getMetadata(true);
        const metadata = yaml.load(rawMetadata) || {};

        return { metadata, html };
    }
}
