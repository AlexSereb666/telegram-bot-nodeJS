const { ProductType } = require('../models/models')

class typeController { 
    // создание записи //
    async addType(req, res) {
        try {
            let { name } = req.body
            const type = await ProductType.create({ name })
            return res.json(type)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // вывод одной записи по id //
    async getOne(req, res) {
        const {id} = req.params
        const type = await ProductType.findOne({
            where: {id}
        })
        return res.json(type)
    }

    // вывод всех записей //
    async getAll(req, res) {
        try {
            const types = await ProductType.findAll();
            return res.json({ types });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // редактирование //
    async editType(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            let type = await ProductType.findOne({ where: { id } });
            if (!type) {
                return res.status(404).json({ message: `Тип не найден` });
            }
            
            type.name = name;
            await type.save();
            
            return res.json(type);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление записи //
    async deleteType(req, res) {
        try {
            const {id} = req.params;
    
            const type = await ProductType.findOne({ where: { id } });
            if (!type) {
                return res.status(404).json({ message: `Тип не найден` });
            }
    
            await ProductType.destroy({ where: { id } });
            return res.json({ message: 'Тип успешно удален' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new typeController()
