import { Category } from "../data/Category";
import { BaseModifier } from "./BaseModifier";

export class CategoryModifier extends BaseModifier {
  async element(element) {

    const categoryTemplate = await this.getAssetContent(
      "/templates/category/list"
    );
    const categoryItemTemplate = await this.getAssetContent(
      "/templates/category/item"
    );

    const category = new Category(this.context.env.DB);
    const categories = await this.getCached<Array<Category>>("/obj/categories/withcount",  async () => {
      return await category.getAllWithCount()
    });

    console.log("GETR", categories, categoryItemTemplate);

    const categoryListHTML = categoryTemplate.replace(
      "{CATEGORY_LIST}",
      categories
        .map((category) =>
          categoryItemTemplate
            .replace("{PATH}", `/categories/${category.ID}`)
            .replace("{NAME}", category.Name)
            .replace("{POST_COUNT}", category.Count.toString())
        )
        .join("")
    );

    console.log("HTML", categoryListHTML);
    element.replace(categoryListHTML, { html: true });
  }
}
