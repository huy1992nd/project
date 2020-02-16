/**
 * Created by nguyen.quang.huy on 5/23/2017.
 */
const config = require('config');
var mysql = require('mysql');
let { log } = require('./../../lib/log');
let { gSequence } = require('./../../define');

class MySqlController {
	constructor() {
		this.pool = mysql.createPool(config.get('mysql'));
	}
	ExeQuery(req, res) {
		this.pool.getConnection(function (err, connection) {
			if (err) {
				res(err);
				return;
			}

			if (req.query) {
				log.info('SQL:', req.query,req.values);
			} else {
				log.info("errrrrrrrrrrrrrr", req);
			}

			if (req.values)
				connection.query(req.query, req.values, function (err, rows, fields) {
					connection.release();
					if (!err) {
						res(err, rows, fields);
					}
					else {
						console.log('have error connection to mysql',err);
						res(err);
					}
				});
			else
				connection.query(req.query, function (err, rows, fields) {
					connection.release();
					if (!err) {
						res(err, rows, fields);
					}
					else {
						console.log(err);
						res(err);
					}
				});

			connection.on('error', function (err) {
				res(err);
				return;
			});
		});
	}


	Query(sql) {
		return new Promise((resolve) => {
			log.info("SQL", sql);
			this.pool.getConnection(function (err, connection) {
				if (err) {
					log.error(err);
					resolve(null);
					return;
				}
				if (sql.values)
					connection.query(sql.query, sql.values, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						} else {
							log.error(err);
					resolve(null);
						}
					});
				else
					connection.query(sql, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						}
						else {
							log.error(err);
					resolve(null);
						}
					});
				connection.on('error', function (err) {
					log.error(err);
					resolve(null);
					return;
				});
			});
		})
	}

	QueryValue(query,values = null) {
		return new Promise((resolve) => {
			log.info("SQL", query,values);
			this.pool.getConnection(function (err, connection) {
				if (err) {
					resolve(null);
					return;
				}
				if (values)
					connection.query(query, values, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						} else {
							resolve(null);
						}
					});
				else
					connection.query(query, function (err, rows, fields) {
						connection.release();
						if (!err) {
							resolve(rows);
						}
						else {
							resolve(null);
						}
					});
				connection.on('error', function (err) {
					resolve(null);
					return;
				});
			});
		})
	}

	Transaction(sql) {
		return new Promise((resolve, reject) => {
			log.info('sql transaction:', sql);
			this.pool.getConnection(function (err, conn) {
				if (err) {
					reject(null);
					return;
				}
				log.info('pool.getConnection');
				var nTime = +new Date();

				/* Begin transaction */
				conn.beginTransaction(function (err) {
					log.info('pool.beginTransaction', nTime);
					// --conn.query(aQuery.join('\n'), function(err, rows, fields) {
					conn.query(sql, function (err, rows, fields) {

						if (err) {
							log.info(new Date().toISOString(), 'Error while performing transaction.', err.code, err.message);
							conn.rollback(() => {
								log.info('rollback');
								conn.release();		// Do not remove this line.
								reject('rollback');
							});
						} else {
							conn.commit(function (err) {
								if (err) {

									log.info(new Date().toISOString(), 'Error while performing commit.', err.code, err.message);
									conn.rollback(function () {
										//								throw utils.error.DATABASE_ERROR;	// TODO
										log.info('rollback2');
										conn.release();		// Do not remove this line.
										reject('rollback');
									})
								} else {
									conn.release();

									log.info('pool.endTransaction');
									resolve(true);
								}
							});
						}
					});
				});
			});
		})
	}

	TransactionValue(sql, value) {
		return new Promise((resolve, reject) => {
			 log.info('sql transaction:', sql,value);
			this.pool.getConnection(function (err, conn) {
				if (err) {
					reject(null);
					return;
				}
				// log.info('pool.getConnection');
				var nTime = +new Date();

				/* Begin transaction */
				conn.beginTransaction(function (err) {
					// log.info('pool.beginTransaction', nTime);
					// --conn.query(aQuery.join('\n'), function(err, rows, fields) {
					conn.query(sql, value, function (err, rows, fields) {

						if (err) {
							log.info(new Date().toISOString(), 'Error while performing transaction.', err.code, err.message);
							conn.rollback(() => {
								// log.info('rollback');
								conn.release(); // Do not remove this line.
								reject('rollback');
							});
						} else {
							conn.commit(function (err) {
								if (err) {

									 log.info(new Date().toISOString(), 'Error while performing commit.', err.code, err.message);
									conn.rollback(function () {
										//								throw utils.error.DATABASE_ERROR;	// TODO
										// log.info('rollback2');
										conn.release(); // Do not remove this line.
										reject('rollback');
									})
								} else {
									conn.release();

									// log.info('pool.endTransaction');
									resolve(rows);
								}
							});
						}
					});
				});
			});
		})
	}

	InitData() {
		return new Promise((resolve, reject) => {
			resolve(true);
			return;
			let sql = `
		SELECT deposit,MAX(order_code) as order_code FROM fx_orders group by deposit;
		SELECT deposit,MAX(invoice_code) as invoice_code FROM fx_invoice group by deposit;
		SELECT deposit,MAX(sequence_number) as sequence_number FROM fx_transaction group by deposit;
		SELECT MAX(customer_code) as max FROM fx_master.fx_customer;
		SELECT max
  FROM (SELECT MAX(product_code)as max FROM fx_products
        UNION
        SELECT MAX(product_code) as max FROM fx_products_retailer
        UNION
         SELECT MAX(product_code) as max FROM fx_products_publisher
       ) AS M
 ORDER BY max desc
 LIMIT 1;
		`;
			//select hash from fx_transaction where sequence_number in ( SELECT MAX(sequence_number) as sequence_number FROM fx_transaction);
			this.Query(sql)
				.then(rows => {
					console.log(rows);
					if (rows.length == 5) {
						for (let i = 0, a = rows[0]; i < a.length; i++) {
							if (!gSequence[a[i].deposit])
								gSequence[a[i].deposit] = {};
							gSequence[a[i].deposit].order_code =  +a[i].order_code.substr(-8);
						}
						for (let i = 0, a = rows[1]; i < a.length; i++) {
							if (!gSequence[a[i].deposit])
								gSequence[a[i].deposit] = {};
							gSequence[a[i].deposit].invoiceCode =  +a[i].invoice_code.substr(-8);
						}

						for (let i = 0, a = rows[2]; i < a.length; i++) {
							if (!gSequence[a[i].deposit])
								gSequence[a[i].deposit] = {};
							gSequence[a[i].deposit].sequence_number = a[i].sequence_number;
						}
						if(rows[3][0].max){
							gSequence.max_customer_code = +rows[3][0].max.substr(-8);
						}
						if(rows[4][0].max && rows[4][0].max.length >8){
							gSequence.max_product_code = +rows[4][0].max.substr(-8);
						}			
					}
					log.info("gSequence:", gSequence);
					resolve();
				})
				.catch(err => {
					log.error('DATABASE ERROR');
					reject(err);

				})
		})

	}
}

module.exports = new MySqlController();