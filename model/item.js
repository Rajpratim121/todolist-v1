import mongoose from "mongoose";
const { Schema, model } = mongoose;

const itemsSchema = new Schema({
  name: String,
});

const listSchema = new Schema({
  title: String,
  items: [itemsSchema],
});

const Item = model("Item", itemsSchema);
const List = model("List", listSchema);

export { Item, List };
