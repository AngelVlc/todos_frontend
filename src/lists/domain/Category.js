export class Category {
  constructor({ id, name, description, isFavourite }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isFavourite = isFavourite;
  }

  static createEmpty() {
    return new Category({ id: -1, name: "", description: "", isFavourite: false });
  }
}
