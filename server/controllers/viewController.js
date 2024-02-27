const { ProductView } = require('../models/models')

class viewController { 
    // создание записи //
    async addView(req, res) {
        try {
            let { name } = req.body
            const view = await ProductView.create({ name })
            return res.json(view)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // вывод одной записи по id //
    async getOne(req, res) {
        const {id} = req.params
        const view = await ProductView.findOne({
            where: {id}
        })
        return res.json(view)
    }

    // вывод всех записей //
    async getAll(req, res) {
        try {
            const views = await ProductView.findAll();
            return res.json({ views });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // редактирование //
    async editView(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            let view = await ProductView.findOne({ where: { id } });
            if (!view) {
                return res.status(404).json({ message: `Вид не найден` });
            }
            
            view.name = name;
            await view.save();
            
            return res.json(view);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление записи //
    async deleteView(req, res) {
        try {
            const {id} = req.params;
    
            const view = await ProductView.findOne({ where: { id } });
            if (!view) {
                return res.status(404).json({ message: `Вид не найден` });
            }
    
            await ProductView.destroy({ where: { id } });
            return res.json({ message: 'Вид успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new viewController()
