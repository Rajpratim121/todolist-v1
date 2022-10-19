import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
import { Item, List } from "./model/item.js";
const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Foyer2641:EeZ2wCSxt56BX3@todolist.wzhidt3.mongodb.net/?retryWrites=true&w=majority"
);

const item1 = {
  name: "welcome to your todolist",
};
const item2 = {
  name: "hit the + button to add a new item",
};
const item3 = {
  name: "<-- hit this button to delete an item",
};
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) return handleError(err);
      });
      res.redirect("/");
    } else {
      res.render("list", { title: "General", newListItems: foundItems });
    }
  });
});

app.get("/:title", (req, res) => {
  const listTitle = _.capitalize(req.params.title);

  List.findOne({ title: listTitle }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        List.create({ title: listTitle, items: defaultItems }, (err) => {
          if (!err) {
            console.log(`${listTitle} list created`);
          }
          res.redirect(`/${listTitle}`);
        });
      } else {
        res.render("list", { title: listTitle, newListItems: foundList.items });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newListItem;
  const listTitle = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listTitle === "General") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ title: listTitle }, (err, foundList) => {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect(`/${foundList.title}`);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listTitle = req.body.list;

  if (listTitle === "General") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) return handlError(err);
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { title: listTitle },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect(`/${listTitle}`);
        }
      }
    );
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
