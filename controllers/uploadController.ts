import { Request, Response } from 'express';

export const uploadSlip = (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // You can access the uploaded file's information in req.file
        const filename = req.file.filename;

        // Perform any additional processing or database operations here
        res.status(200).json({ message: 'File uploaded successfully.', filename });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}