const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll({
      include: [{
          model: Product,
          as: 'products', 
      }]});
    res.json(categories);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Product, 
        as: 'products', 
      }]
    });
    res.json(category);
  }
);

router.post('/', async (req, res) => {
    const { id, category_name } = req.body;
    const newCategory = await Category.create({
      id: id,
      category_name: category_name,
    });
    res.json(newCategory);
  });

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
