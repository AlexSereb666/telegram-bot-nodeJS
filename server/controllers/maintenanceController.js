const { HistoryMaintenance } = require('../models/models');

class maintenanceController {
    async addMaintenance(req, res) {
        try {
            const {title, description, notes, status, dateBegin, dateEnd} = req.body
            const historyMaintenance = await HistoryMaintenance.create({title, description, notes, status, dateBegin, dateEnd})

            return res.json(historyMaintenance)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getAll(req, res) {
        try {
            const historyMaintenance = await HistoryMaintenance.findAll();

            return res.json(historyMaintenance);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async editMaintenance(req, res) {
        try {
            const { id } = req.params;
            const {title, description, notes, status, dateBegin, dateEnd} = req.body;
     
            let historyMaintenance = await HistoryMaintenance.findOne({ where: { id } });
            if (!historyMaintenance) {
                return res.status(404).json({ message: `История не найдена` });
            }

            historyMaintenance.title = title;
            historyMaintenance.description = description;
            historyMaintenance.notes = notes;
            historyMaintenance.status = status;
            historyMaintenance.dateBegin = dateBegin;
            historyMaintenance.dateEnd = dateEnd;
        
            await historyMaintenance.save();
            
            return res.json(historyMaintenance);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async deleteMaintenance(req, res) {
        try {
            const { id } = req.params;
    
            const historyMaintenance = await HistoryMaintenance.findOne({ where: { id } });
            if (!historyMaintenance) {
                return res.status(404).json({ message: `История не найдена` });
            }
    
            await HistoryMaintenance.destroy({ where: { productId: id } });
    
            return res.json({ message: 'История успешна удалена' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

}

module.exports = new maintenanceController()
