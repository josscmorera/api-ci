const Report = require('../models/report');

const createReport = async (req, res) => {
    try {
        const { content, type, typeId } = req.body;
        
        const id = res.locals.decodedToken.id;

        const newReport = new Report({ content, type, typeId, user: id });

        const savedReport = await newReport.save();

        return res.status(200).json({ success: true, data: savedReport });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getAllReports = async (req, res) => {
    try {
        const { type, typeId } = req.query;

        const reports = await Report.find({ type, typeId }).populate('user');

        return res.status(200).json({ success: true, data: reports });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id).populate('user');

        if (!report) {
            return res.status(400).json({ success: false, message: "Report not found" });
        }

        return res.status(200).json({ success: true, data: report });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const updateReport = async (req, res) => {
    try {
        const { id } = req.params;

        const { content } = req.body;

        const report = await Report.findById(id).populate('user');

        if (!report) {
            return res.status(400).json({ success: false, message: "Report not found" });
        }

        const updatedReport = await Report.findByIdAndUpdate(id, { content }, { new: true });

        return res.status(200).json({ success: true, data: updatedReport });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReport = await Report.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(400).json({ success: false, message: "Report not found" });
        }

        return res.status(200).json({ success: true, data: deletedReport });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
};