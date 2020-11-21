//  - npm init   -- npm install cli-table3  ---npm install sqlite3
// create table login (user character(20) primary key not null, password character (20), pengguna character (20) );
// insert into login ( user, password, pengguna) values ( 'ades', 'ades','ADMIN' ), ('yono','yono','USER');


const readline = require('readline');          // Modul Read Line ke terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const Table = require('cli-table3');              // modul koneksi kedatabase
const sqlite3 = require('sqlite3').verbose();     // mengimport modul sqlite3 
let db = new sqlite3.Database('./university.db', err => {
    if (err) throw err;
});

class University {
    tampilanAwal() {
        console.log("==============================================");
        console.log("Welcome to Universitas Pendidikan Indonesia");
        console.log("Jl. Setiabudhi No. 225");
        console.log("==============================================");
        return this.menuLogin();
    }
    menuLogin() {
        const sqlName = `SELECT user FROM login WHERE user = ?`;
        const sqlPass = `SELECT password FROM login WHERE password = ?`;
        //const sqlPng = `SELECT pengguna FROM login WHERE  pengguna = ?`;
        rl.question('username : ', answer => {
            let isName = answer;
            db.all(sqlName, [isName], (err) => {
                if (err) throw err;
                console.log('==============================================');
                rl.question('password: ', answer => {
                    let passd = answer;
                    db.all(sqlPass, [passd], (err, rows) => {
                        if (err) throw err;
                        if (rows.length > 0 && passd === rows[0].password) {
                            console.log('==============================================');
                            console.log(`Welcome, ${isName} your access level is: ADMIN `);
                            const success = new Home();
                            success.isHome();
                        } else {
                            console.log();
                            console.log('  Username atau password salah.');
                            console.log('   Harap Isi dengan benar !!!!');
                            console.log('--->> Silakan Dicoba lagi <<----')
                            process.exit(0);
                        }
                    });
                });
            });
        });
    }
}

class Home extends University {
    isHome() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Mahasiswa");
        console.log("[2] Jurusan");
        console.log("[3] Dosen");
        console.log("[4] Mata kuliah");
        console.log("[5] Kontrak");
        console.log("[6] Keluar");
        console.log("==============================================");
        return this.isMenu();
    }
    isMenu() {
        rl.question('Masukkan salah satu no, dari opsi diatas: ', (answer) => {
            switch (answer) {
                case '1':
                    const mahasiswa = new Mahasiswa();
                    mahasiswa.mahasiswa();
                    break;
                case '2':
                    const jurusan = new Jurusan();
                    jurusan.jurusan();
                    break;
                case '3':
                    const dosen = new Dosen();
                    dosen.dosen();
                    break;
                case '4':
                    const matkul = new Matkul();
                    matkul.matakuliah();
                    break;
                case '5':
                    const kontrak = new Nilai();
                    kontrak.nilai();
                    break;
                case '6':
                    process.exit(0);
                    break
                default:
                    this.question();
                    break;
            }
        });
    }
}
// mahasiswa

class Mahasiswa {
    mahasiswa() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Daftar murid");
        console.log("[2] Cari murid");
        console.log("[3] Tambah murid");
        console.log("[4] Hapus murid");
        console.log("[5] Kembali");
        console.log("==============================================");
        return this.menuMahasiswa();
    }
    menuMahasiswa() {
        rl.question("Masukkan salah satu no, dari opsi di atas = ", (answer) => {
            switch (answer) {
                case '1':
                    this.showMahasiswa();
                    break;
                case '2':
                    this.searchMahasiswa();
                    break;
                case '3':
                    this.addMahasiswa();
                    break;
                case '4':
                    this.deleteMahasiswa();
                    break;
                case '5':
                    const kembali = new Home();
                    kembali.isHome();
                    break;
                default:
                    this.menuMahasiswa();
                    break;
            }
        });
    }
    showMahasiswa() {
        const sql = `SELECT * FROM mahasiswa`;
        db.all(sql, [], (err, rows) => {
            if (err) throw err; const table = new Table({
                head: ['NIM', 'Nama', 'Alamat', 'Umur', 'Jurusan'], colWidths: [8, 17, 20, 8, 10]
            });
            rows.forEach(row => {
                table.push([row.nim, row.nama, row.alamat, row.umur, row.id_jurusan]);
            });
            console.log('==============================================');
            console.log(table.toString());
            this.mahasiswa();
        });
    }
    searchMahasiswa() {
        console.log('==============================================');
        rl.question('Masukkan NIM = ', (answer) => {
            let nim = answer;
            const sql = `SELECT nim, nama, alamat, id_jurusan, umur FROM mahasiswa WHERE mahasiswa.nim = ?`;
            db.all(sql, [nim], (err, rows) => {
                if (err) throw err; if (rows.length > 0) {
                    console.log('==============================================');
                    console.log('Data Mahasiswa');
                    console.log('==============================================');
                    console.log(`NIM      : ${rows[0].nim}`);
                    console.log(`Nama     : ${rows[0].nama}`);
                    console.log(`Alamat   : ${rows[0].alamat}`);
                    console.log(`Umur     : ${rows[0].umur}`);
                    console.log(`Jurusan  : ${rows[0].id_jurusan}`);
                    this.mahasiswa();
                } else {
                    console.log(`Mahasiswa dengan NIM: ${nim} tidak terdaftar.`);
                    this.searchMahasiswa();
                }
            })
        })
    }
    addMahasiswa() {
        console.log('==============================================');
        console.log('Lengkapi data di bawah ini:');
        rl.question("Nama     : ", (nama) => {
            rl.question("Alamat   : ", (alamat) => {
                rl.question("Jurusan  : ", (id_jurusan) => {
                    rl.question("Umur     : ", (umur) => {
                        const sql = `INSERT INTO mahasiswa (nama, alamat, id_jurusan, umur) VALUES (?, ?, ?, ?)`;
                        let newNama = nama;
                        let newAlamat = alamat;
                        let newUmur = umur;
                        let newJurusan = id_jurusan;
                        db.all(sql, [newNama, newAlamat, newJurusan, newUmur], (err) => {
                            if (err) throw err;
                            console.log('==============================================');
                            console.log('Data mahasiswa baru berhasil ditambahkan.');
                            this.showMahasiswa();
                        })
                    })
                })
            })
        })
    }
    deleteMahasiswa() {
        console.log('====================================================');
        rl.question('Masukkan NIM mahasiswa yang akan dihapus = ', answer => {
            let nim = answer;
            const sql = `DELETE FROM mahasiswa WHERE nim = ?`;
            db.run(sql, [nim], err => {
                if (err) throw err;
                console.log('==============================================');
                console.log(`Mahasiswa dengan NIM: ${nim} telah dihapus`);
                console.log(`Mahasiswa dengan NIM ${nim} telah dihapus.`);
                this.showMahasiswa();
            });
        });
    }
}

// Jurusan
class Jurusan {
    jurusan() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Daftar Jurusan");
        console.log("[2] Cari Jurusan");
        console.log("[3] Tambah Jurusan");
        console.log("[4] Hapus Jurusan");
        console.log("[5] Kembali");
        console.log("==============================================");
        return this.isJurusan();
    }
    isJurusan() {
        rl.question("Masukkan salah satu No. dari opsi di atas = ", (answer) => {
            switch (answer) {
                case '1':
                    this.showJurusan();
                    break;
                case '2':
                    this.searchJurusan();
                    break;
                case '3':
                    this.addJurusan();
                    break;
                case '4':
                    this.deleteJurusan();
                    break;
                case '5':
                    const kembali = new Home();
                    kembali.isHome();
                    break;
                default:
                    this.jurusan();
                    break;
            }
        });
    }
    showJurusan() {
        const sql = `SELECT * FROM jurusan`;
        db.all(sql, [], (err, rows) => {
            if (err) throw err;
            const table = new Table({
                head: ['ID', 'Nama Jurusan'], colWidths: [7, 32]
            });
            rows.forEach(row => {
                table.push([row.id_jurusan, row.nama_jurusan]);
            });
            console.log('==============================================');
            console.log(table.toString());
            this.jurusan();
        });
    }
    searchJurusan() {
        console.log('==============================================');
        rl.question('Masukkan ID Jurusan = ', (answer) => {
            let id = answer;
            const sql = `SELECT * FROM jurusan WHERE jurusan.id_jurusan = ?`;
            db.all(sql, [id], (err, rows) => {
                if (err) throw err; if (rows.length > 0) {
                    console.log('==============================================');
                    console.log('Data Jurusan');
                    console.log('==============================================');
                    console.log(`ID           : ${rows[0].id_jurusan}`);
                    console.log(`Nama Jurusan : ${rows[0].nama_jurusan}`);
                    this.jurusan();
                } else {
                    console.log(`Jurusan dengan ID : ${id} tidak terdaftar.`);
                    this.searchJurusan();
                }
            })
        })
    }
    addJurusan() {
        console.log('==============================================');
        console.log('Input Data Nama Jurusan yang mau ditambahkan.');
        rl.question("Nama Jurusan  : ", (namajurusan) => {
            const sql = `INSERT INTO jurusan (nama_jurusan) VALUES (?)`;
            let newJurusan = namajurusan;
            db.all(sql, [newJurusan], (err) => {
                if (err) throw err;
                console.log('==============================================');
                console.log(`Nama Jurusan ${newJurusan} berhasil di tambahkan`);
                this.showJurusan();
            })
        })
    }
    deleteJurusan() {
        console.log('====================================================');
        rl.question('Masukkan ID Jurusan yang akan dihapus = ', answer => {
            let id = answer;
            const sql = `DELETE FROM jurusan WHERE id_jurusan = ?`;
            db.run(sql, [id], (err) => {
                if (!err)
                    console.log('==============================================');
                console.log(`Jurusan dengan ID: ${id} telah berhasil dihapus.`);
                console.log(`Jurusan dengan ID ${id} telah berhasil dihapus`);
                this.showJurusan();
            });
        });
    }
}

// Dosen
class Dosen {
    dosen() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Daftar Dosen");
        console.log("[2] Cari Dosen");
        console.log("[3] Tambah Dosen");
        console.log("[4] Hapus Dosen");
        console.log("[5] Kembali");
        console.log("==============================================");
        return this.isDosen();
    }
    isDosen() {
        rl.question("Masukkan salah satu No. dari opsi di atas = ", (answer) => {
            switch (answer) {
                case '1':
                    this.showDosen();
                    break;
                case '2':
                    this.searchDosen();
                    break;
                case '3':
                    this.addDosen();
                    break;
                case '4':
                    this.deleteDosen();
                    break;
                case '5':
                    const kembali = new Home();
                    kembali.isHome();
                    break;
                default:
                    this.dosen();
                    break;
            }
        });
    }
    showDosen() {
        const sql = `SELECT * FROM dosen`;
        db.all(sql, [], (err, rows) => {
            if (err) throw err;
            const table = new Table({
                head: ['ID Dosen', 'Nama Dosen'], colWidths: [10, 32]
            });
            rows.forEach(row => {
                table.push([row.id_dosen, row.nama_dosen]);
            });
            console.log('==============================================');
            console.log(table.toString());
            this.dosen();
        });
    }
    searchDosen() {
        console.log('==============================================');
        rl.question('Masukkan ID Dosen = ', (answer) => {
            let id = answer;
            const sql = `SELECT * FROM dosen WHERE dosen.id_dosen = ?`;
            db.all(sql, [id], (err, rows) => {
                if (err) throw err; if (rows.length > 0) {
                    console.log('==============================================');
                    console.log('Data Dosen');
                    console.log('==============================================');
                    console.log(`ID Dosen     : ${rows[0].id_dosen}`);
                    console.log(`Nama Jurusan : ${rows[0].nama_dosen}`);
                    this.dosen();
                } else {
                    console.log(`Dosen dengan ID : ${id} tidak terdaftar.`);
                    this.searchDosen();
                }
            })
        })
    }
    addDosen() {
        console.log('==============================================');
        console.log('Input Data Dosen yang mau ditambahkan.');
        rl.question("ID Dosen    : ", (idDosen) => {
            rl.question("Nama Dosen  : ", (namaDosen) => {
                const sql = `INSERT INTO dosen (id_dosen, nama_dosen) VALUES (?,?)`;
                let newIdDosen = idDosen;
                let newDosen = namaDosen;
                db.all(sql, [newIdDosen, newDosen], (err) => {
                    if (err) throw err;
                    console.log('==============================================');
                    console.log(`ID dosen ${newIdDosen} dengan nama ${newDosen} berhasil di tambahkan`);
                    this.showDosen();
                })
            })
        })
    }
    deleteDosen() {
        console.log('====================================================');
        rl.question('Masukkan ID Dosen yang akan dihapus = ', answer => {
            let id = answer;
            const sql = `DELETE FROM dosen WHERE id_dosen = ?`;
            db.run(sql, [id], (err) => {
                if (!err)
                    console.log('==============================================');
                console.log(`Jurusan dengan ID: ${id} telah berhasil dihapus.`);
                console.log(`Jurusan dengan ID ${id} telah berhasil dihapus`);
                this.showDosen();
            });
        });
    }
}

// Matakuliah
class Matkul {
    matakuliah() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Daftar Matakuliah");
        console.log("[2] Cari matakuliah");
        console.log("[3] Tambah matakuliah");
        console.log("[4] Hapus matakuliah");
        console.log("[5] Kembali");
        console.log("==============================================");
        return this.isMatkul();
    }
    isMatkul() {
        rl.question("Masukkan salah satu No. dari opsi di atas = ", (answer) => {
            switch (answer) {
                case '1':
                    this.showMatkul();
                    break;
                case '2':
                    this.searchMatkul();
                    break;
                case '3':
                    this.addMatkul();
                    break;
                case '4':
                    this.deleteMatkul();
                    break;
                case '5':
                    const kembali = new Home();
                    kembali.isHome();
                    break;
                default:
                    this.matakuliah();
                    break;
            }
        });
    }
    showMatkul() {
        const sql = `SELECT * FROM matakuliah`;
        db.all(sql, [], (err, rows) => {
            if (err) throw err;
            const table = new Table({
                head: ['ID Matakuliah', 'Nama Matakuliah', 'SKS', 'ID Dosen'], colWidths: [10, 32, 7, 10]
            });
            rows.forEach(row => {
                table.push([row.id_matkul, row.nama_matkul, row.sks, row.id_dosen]);
            });
            console.log('==============================================');
            console.log(table.toString());
            this.matakuliah();
        });
    }
    searchMatkul() {
        console.log('==============================================');
        rl.question('Masukkan ID Matakuliah = ', (answer) => {
            let id = answer;
            const sql = `SELECT * FROM matakuliah WHERE matakuliah.id_matkul = ?`;
            db.all(sql, [id], (err, rows) => {
                if (err) throw err; if (rows.length > 0) {
                    console.log('==============================================');
                    console.log('Data Dosen');
                    console.log('==============================================');
                    console.log(`ID Matakuliah                : ${rows[0].id_matkul}`);
                    console.log(`Nama Matakuliah              : ${rows[0].nama_matkul}`);
                    console.log(`Satuan Kredit Semester (SKS) : ${rows[0].sks}`);
                    console.log(`ID Dosen Pengajar            : ${rows[0].id_dosen}`);
                    this.matakuliah();
                } else {
                    console.log(`Matakuliah dengan ID : ${id} tidak terdaftar.`);
                    this.searchMatkul();
                }
            })
        })
    }
    addMatkul() {
        console.log('==============================================');
        console.log('Input Data Matakuliah yang mau ditambahkan.');
        rl.question("ID Matakuliah                : ", (idMatkul) => {
            rl.question("Nama Matakuliah              : ", (namaMatkul) => {
                rl.question("Satuan Kredit Semester (SKS) : ", (sks) => {
                    rl.question("ID Dosen Pengajar            : ", (idDosen) => {
                        const sql = `INSERT INTO matakuliah (id_matkul, nama_matkul, sks, id_dosen) VALUES (?,?,?,?)`;
                        let newIdMatkul = idMatkul;
                        let newNamaMatkul = namaMatkul;
                        let newSks = sks;
                        let newDosen = idDosen;
                        db.all(sql, [newIdMatkul, newNamaMatkul, newSks, newDosen], (err) => {
                            if (err) throw err;
                            console.log('==============================================');
                            console.log(`ID Matakuliah ${newIdMatkul} dengan nama ${newNamaMatkul} berhasil di tambahkan`);
                            this.showMatkul();
                        })
                    })
                })
            })
        })
    }
    deleteMatkul() {
        console.log('====================================================');
        rl.question('Masukkan ID Matakuliah yang akan dihapus = ', answer => {
            let id = answer;
            const sql = `DELETE FROM matakuliah WHERE id_matkul = ?`;
            db.run(sql, [id], (err) => {
                if (!err)
                    console.log('==============================================');
                console.log(`Matakuliah dengan ID: ${id} telah berhasil dihapus.`);
                console.log(`Matakuliah dengan ID ${id} telah berhasil dihapus`);
                this.showMatkul();
            });
        });
    }
}

// Nilai
class Nilai {
    nilai() {
        console.log("==============================================");
        console.log("Silahkan pilih opsi di bawah ini:");
        console.log("[1] Daftar Nilai");
        console.log("[2] Cari Nilai");
        console.log("[3] Tambah Nilai");
        console.log("[4] Hapus NIlai");
        console.log("[5] Kembali");
        console.log("==============================================");
        return this.isNilai();
    }
    isNilai() {
        rl.question("Masukkan salah satu No. dari opsi di atas = ", (answer) => {
            switch (answer) {
                case '1':
                    this.showNilai();
                    break;
                case '2':
                    this.searchNilai();
                    break;
                case '3':
                    this.addNilai();
                    break;
                case '4':
                    this.deleteNilai();
                    break;
                case '5':
                    const kembali = new Home();
                    kembali.isHome();
                    break;
                default:
                    this.nilai();
                    break;
            }
        });
    }
    showNilai() {
        const sql = `SELECT * FROM nilai `;
        db.all(sql, [], (err, rows) => {
            if (err) throw err;
            const table = new Table({
                head: ['ID Nilai', 'NIM Mahasiswa', 'ID Matakuliah', 'ID Dosen', 'Index Nilai'], colWidths: [10, 15, 15, 10, 15]
            });
            rows.forEach(row => {
                table.push([row.id_nilai, row.nim, row.id_matkul, row.id_dosen, row.indeks]);
            });
            console.log('==============================================');
            console.log(table.toString());
            this.nilai();
        });
    }
    searchNilai() {
        console.log('==============================================');
        rl.question('Masukkan ID Nilai = ', (answer) => {
            let id = answer;
            const sql = `SELECT * FROM nilai WHERE nilai.id_nilai = ?`;
            db.all(sql, [id], (err, rows) => {
                if (err) throw err; if (rows.length > 0) {
                    console.log('==============================================');
                    console.log('Data Dosen');
                    console.log('==============================================');
                    console.log(`ID Nilai               : ${rows[0].id_nilai}`);
                    console.log(`NIM Mahasiswa          : ${rows[0].nim}`);
                    console.log(`ID Matakuliah          : ${rows[0].id_matkul}`);
                    console.log(`ID Dosen Pengajar      : ${rows[0].id_dosen}`);
                    console.log(`Index Nilai            : ${rows[0].indeks}`);
                    this.nilai();
                } else {
                    console.log(`Data Nilai dengan ID : ${id} tidak terdaftar.`);
                    this.searchNilai();
                }
            })
        })
    }
    addNilai() {
        console.log('==============================================');
        console.log('Input Data Nilai Matakuliah yang mau ditambahkan.');
        rl.question("ID Nilai               : ", (idNilai) => {
            rl.question("NIM Mahasiswa          : ", (nim) => {
                rl.question("ID Matakuliah          : ", (idMatkul) => {
                    rl.question("ID Dosen Pengajar      : ", (idDosen) => {
                        rl.question("Indeks Nilai Mahasiswa : ", (indeks) => {
                            const sql = `INSERT INTO nilai (id_nilai, nim, id_matkul, id_dosen, indeks) VALUES (?,?,?,?,?)`;
                            let newIdNilai = idNilai;
                            let newNim = nim;
                            let newIdMatkul = idMatkul;
                            let newIdDosen = idDosen;
                            let newIndeks = indeks;
                            db.all(sql, [newIdNilai, newNim, newIdMatkul, newIdDosen, newIndeks], (err) => {
                                if (err) throw err;
                                console.log('==============================================');
                                console.log(`ID Nilai ${newIdNilai} berhasil di tambahkan`);
                                this.showNilai();
                            })
                        })
                    })
                })
            })
        })
    }
    deleteNilai() {
        console.log('====================================================');
        rl.question('Masukkan ID Nilai yang akan dihapus = ', answer => {
            let id = answer;
            const sql = `DELETE FROM nilai WHERE id_nilai = ?`;
            db.run(sql, [id], (err) => {
                if (!err)
                    console.log('==============================================');
                console.log(`Nilai dengan ID: ${id} telah berhasil dihapus.`);
                console.log(`Nilai dengan ID ${id} telah berhasil dihapus`);
                this.showNilai();
            });
        });
    }
}

const run = new University();
run.tampilanAwal();
