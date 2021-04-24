import {Categories, Table} from "../models";


class TableController {

    static getTable = async (req, res, next) => {
        try {
            const result = await Table.findAll()
            res.json({
                status: 'ok',
                result,
            })
        } catch (e) {
            next(e);
        }
    }

    static createTable = async (req, res, next) => {
        try {
            const {restId, number, status} = req.body
            const result = await Table.create({
                restId, number, status
            })
            res.json({
                status: 'ok',
                result,
            })
        } catch (e) {
            next(e)
        }
    }
    static updateTables = async (req, res, next) => {
        try {
            const {id} = req.body;
            const {restId, number, status} = req.body;
            await Table.update({
                    restId, number, status
                },
                {
                    where: {
                        id,
                    }
                })
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    }

    static deleteTable = async (req, res, next) => {
        try {

            const {id} = req.body
            await Table.destroy({
                where: {
                    id,
                }
            })

            res.json({
                status: 'Deleted',
            })
        } catch (e) {
            next(e)
        }
    }
}

export default TableController;