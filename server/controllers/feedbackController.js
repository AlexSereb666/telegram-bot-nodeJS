const { Feedback } = require("../models/models");

class feedbackController {

    // создание заявки в тех. поддержку //
    async createFeedback(req, res) {
        const { userId, title, message } = req.body;
        try {
            const feedback = await Feedback.create({ userId, title, message });
            return res.status(201).json({ message: 'Заявка успешно создана', feedback });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // изменение статуса заявки //
    async updateFeedbackStatus(req, res) {
        const id = req.params.id;
        const { status } = req.body;

        try {
            const updatedFeedback = await Feedback.update(
                { status },
                { where: { id: id }, returning: true }
            );

            if (updatedFeedback[0] === 0) {
                return res.status(404).json({ message: `Заявка с id ${id} не найдена` });
            }

            const [feedback] = updatedFeedback[1];

            return res.json({ message: 'Статус заявки успешно обновлен', feedback });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // выборка всех заявок //
    async getAllFeedbacks(req, res) {
        try {
            const feedbacks = await Feedback.findAll();
            return res.json({ feedbacks });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // выборка одной заявки по id //
    async getFeedbackById(req, res) {
        const id = req.params.id;

        try {
            const feedback = await Feedback.findOne({ where: { id: id } });

            if (!feedback) {
                return res.status(404).json({ message: `Заявка с id ${id} не найдена` });
            }

            return res.json({ feedback });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // выборка заявок конкретного пользователя //
    async getFeedbackByUserId(req, res) {
        const userId = req.params.id;

        try {
            const Feedbacks = await Feedback.findAll({ where: { userId: userId } });

            if (!Feedbacks) {
                return res.status(404).json({ message: `Заявки пользователя с id ${userId} не найдены` });
            }

            return res.json({ Feedbacks });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    // удаление заявки //
    async deleteFeedbackById(req, res) {
        const id = req.params.id;
    
        try {
            const deletedFeedbackCount = await Feedback.destroy({ where: {id: id } });
    
            if (deletedFeedbackCount === 0) {
                return res.status(404).json({ message: `Заявка с id ${id} не найден` });
            }
    
            return res.json({ message: `Заявка с id ${id} успешно удалена` });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new feedbackController()
