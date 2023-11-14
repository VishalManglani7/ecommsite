const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    attributes: ['id', 'category_name'],
      include: [{
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]});
    res.json(categories);
});
//tested and route works

router.get('/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id, {
      attributes: ['id', 'category_name'],
      include: [{
        model: Product,  
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}]
    });
    res.json(category);
  }
);
//tested and route works

router.post('/', async (req, res) => {
    const { id, category_name } = req.body;
    const newCategory = await Category.create({
      id: id,
      category_name: category_name,
    });
    res.json(newCategory);
  });
  // tested and working

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
    const { id, category_name } = req.body;
  const existingCategory = await Category.findByPk(req.params.id);
    await existingCategory.update({
      id,
      category_name,
    });
  
    res.json(existingCategory);});

    //tested and working


  // delete a category by its `id` value
  router.delete('/:id', async (req, res) => {
      const categoryData = await Category.destroy({
        where: {
          id: req.params.id
        }
      });
      res.status(200).json(categoryData);
    });
  //tested and working

module.exports = router;
