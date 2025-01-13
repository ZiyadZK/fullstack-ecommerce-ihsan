

const db_column = require("./column_builder");
const { db } = require("./config");
const db_model_options = require("./model_options");

const Foto_Profil = db.define('Foto_Profil', {
    ...db_column('id').pk().int().increment().build(),
    ...db_column('url').str().null().build()
},
    db_model_options()
        .timestamps(false)
        .tableName('Foto_Profil')
        .build()
)

const User = db.define('User', {
    ...db_column('id').pk().int().increment().build(),
    ...db_column('nama').str().null().build(),
    ...db_column('username').str().notNull().unique('USER_UNIQUE_USERNAME').build(),
    ...db_column('password').str().notNull().build(),
    ...db_column('role').enum(['admin', 'user']).notNull().build(),
    ...db_column('fk_foto_profil').int().null().ref('Foto_Profil').build(),
    ...db_column('created_at').str().null().build(),
    ...db_column('updated_at').str().null().build(),
    ...db_column('deleted_at').str().null().build(),
}, 
    db_model_options()
        .timestamps(false)
        .tableName('User')
        .indexes([
            {
                fields: ['username'],
                name: 'USER_UNIQUE_USERNAME',
                unique: true
            }
        ])
        .build()
)

const Alamat_Penerima = db.define('Alamat_Penerima', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_user').int().notNull().ref('User').build(),
    ...db_column('nama').str().notNull().default('John Doe').build(),
    ...db_column('no_hp').str().notNull().build(),
    ...db_column('alamat').str().notNull().build()
}, 
    db_model_options()
        .tableName('Alamat_Penerima')
        .timestamps(false)
        .build()
)

const Foto_Produk = db.define('Foto_Produk', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('url').str().null().build()
},
    db_model_options()
        .tableName('Foto_Produk')
        .timestamps(false)
        .build()
)

const Produk = db.define('Produk', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().notNull().default('Ini adalah Produk Kami').build(),
    ...db_column('deskripsi').str().null().default('Berikut ini adalah Produk kami yang ada di Coca Cola e-Commerce Store').build(),
    ...db_column('stok').int().default(1).build(),
    ...db_column('satuan').str().notNull().default('botol').build(),
    ...db_column('harga_per_satuan').float().default(1.0).build(),
    ...db_column('fk_foto_produk').int().null().ref('Foto_Produk').build(),
    ...db_column('created_at').str().notNull().build(),
    ...db_column('updated_at').str().notNull().build(),
    ...db_column('deleted_at').str().null().build(),
},
    db_model_options()
        .tableName('Produk')
        .timestamps(false)
        .build()
)

const Kategori = db.define('Kategori', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().notNull().unique('UNIQUE_KATEGORI_NAMA').default('Dingin').build(),
},
    db_model_options()
        .tableName('Kategori')
        .timestamps(false)
        .indexes([
            {
                fields: ['nama'],
                name: 'UNIQUE_KATEGORI_NAMA'
            }
        ])
        .build()
)

const Kategori_Produk = db.define('Kategori_Produk', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_kategori').int().notNull().ref('Kategori').build()
}, 
    db_model_options()
        .tableName('Kategori_Produk')
        .timestamps(false)
        .build()
)



const Kupon = db.define('Kupon', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('code').str().notNull().build(),
    ...db_column('nama').str().notNull().default('Ini adalah Nama Kupon').build(),
    ...db_column('deskripsi').str().default('Ini adalah Deskripsi Kupon').build(),
    ...db_column('mulai').dateonly().notNull().build(),
    ...db_column('selesai').dateonly().null().build(),
    ...db_column('diskon').float().notNull().default(1.0).build(),
},
    db_model_options()
        .tableName('Kupon')
        .timestamps(false)
        .build()
)

const Foto_Payment = db.define('Foto_Payment', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('url').str().notNull().build()
},
    db_model_options()
        .tableName('Foto_Payment')
        .timestamps(false)
        .build()
)

const Payment = db.define('Payment', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('is_confirmed').bool().null().build(),
    ...db_column('fk_foto_payment').int().null().ref('Foto_Payment').build(),
    ...db_column('fk_alamat_penerima').int().null().ref('Alamat_Penerima').build(),
    ...db_column('is_sampai').bool().null().build()
},
    db_model_options()
        .tableName('Payment')
        .timestamps(false)
        .build()
)

const Checkout = db.define('Checkout', {
    ...db_column('id').int().pk().increment().build(),
    ...db_column('fk_kupon').int().null().ref('Kupon').build(),
    ...db_column('fk_payment').int().null().ref('Payment').build(),
    ...db_column('created_at').str().notNull().build(),
    ...db_column('updated_at').str().notNull().build(),
    ...db_column('deleted_at').str().null().build(),
},
    db_model_options()
        .tableName('Checkout')
        .timestamps(false)
        .build()
)

const Keranjang = db.define('Keranjang', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_user').int().notNull().ref('User').build(),
    ...db_column('jumlah').int().notNull().default(1).build(),
    ...db_column('fk_checkout').int().null().ref('Checkout').build()
},
    db_model_options()
        .tableName('Keranjang')
        .timestamps(false)
        .build()
)

const Favorit = db.define('Favorit', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('fk_user').int().notNull().ref('User').build()
},
    db_model_options()
        .tableName('Favorit')
        .timestamps(false)
        .build()
)

const Supplier = db.define('Supplier', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('nama').str().notNull().default('Ini adalah Supplier').build(),
    ...db_column('alamat').str().null().build()
},
    db_model_options()
        .tableName('Supplier')
        .timestamps(false)
        .build()
)

const Riwayat_Supplier = db.define('Riwayat_Supplier', {
    ...db_column('id').int().increment().pk().build(),
    ...db_column('fk_supplier').int().notNull().ref('Supplier').build(),
    ...db_column('fk_produk').int().notNull().ref('Produk').build(),
    ...db_column('jumlah').int().default(1).notNull().build()

},
    db_model_options()
        .tableName('Riwayat_Supplier')
        .timestamps(false)
        .build()
)

// ============================================== RELATIONS

Foto_Profil.hasMany(User, {
    foreignKey: 'fk_foto_profil',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

User.belongsTo(Foto_Profil, {
    foreignKey: 'fk_foto_profil',
    targetKey: 'id',
    onDelete: 'CASCADE'
})

User.hasMany(Alamat_Penerima, {
    foreignKey: 'fk_user',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Alamat_Penerima.belongsTo(User, {
    foreignKey: 'fk_user',
    targetKey: 'id'
})

Foto_Produk.hasOne(Produk, {
    foreignKey: 'fk_foto_produk',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

Produk.belongsTo(Foto_Produk, {
    foreignKey: 'fk_foto_produk',
    targetKey: 'id',
    onDelete: 'SET NULL'
})

Kategori.hasMany(Kategori_Produk, {
    foreignKey: 'fk_kategori',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Kategori_Produk.belongsTo(Kategori, {
    foreignKey: 'fk_kategori',
    targetKey: 'id'
})

Produk.hasMany(Kategori_Produk, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Kategori_Produk.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Produk.hasMany(Keranjang, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Keranjang.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

User.hasMany(Keranjang, {
    foreignKey: 'fk_user',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Keranjang.belongsTo(User, {
    foreignKey: 'fk_user',
    targetKey: 'id'
})

User.hasMany(Favorit, {
    foreignKey: 'fk_user',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Favorit.belongsTo(User, {
    foreignKey: 'fk_user',
    targetKey: 'id'
})

Produk.hasMany(Favorit, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Favorit.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Supplier.hasMany(Riwayat_Supplier, {
    foreignKey: 'fk_supplier',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Riwayat_Supplier.belongsTo(Supplier, {
    foreignKey: 'fk_supplier',
    targetKey: 'id'
})

Produk.hasMany(Riwayat_Supplier, {
    foreignKey: 'fk_produk',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Riwayat_Supplier.belongsTo(Produk, {
    foreignKey: 'fk_produk',
    targetKey: 'id'
})

Foto_Payment.hasMany(Payment, {
    foreignKey: 'fk_foto_payment',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

Payment.belongsTo(Foto_Payment, {
    foreignKey: 'fk_foto_payment',
    targetKey: 'id',
    onDelete: 'CASCADE'
})

Payment.hasOne(Checkout, {
    foreignKey: 'fk_payment',
    sourceKey: 'id',
    onDelete: 'SET NULL'
})

Checkout.belongsTo(Payment, {
    foreignKey: 'fk_payment',
    targetKey: 'id',
    onDelete: 'CASCADE'
})

Kupon.hasMany(Checkout, {
    foreignKey: 'fk_kupon',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Checkout.belongsTo(Kupon, {
    foreignKey: 'fk_kupon',
    targetKey: 'id',
    onDelete: 'CASCADE'
})

Alamat_Penerima.hasMany(Checkout, {
    foreignKey: 'fk_alamat_penerima',
    onDelete: 'CASCADE'
})

Checkout.belongsTo(Alamat_Penerima, {
    foreignKey: 'fk_alamat_penerima',
    onDelete: 'SET NULL'
})

Alamat_Penerima.hasMany(Payment, {
    foreignKey: 'fk_alamat_penerima',
    onDelete: 'CASCADE'
})

Payment.belongsTo(Alamat_Penerima, {
    foreignKey: 'fk_alamat_penerima',
    onDelete: 'SET NULL'
})

Checkout.hasMany(Keranjang, {
    foreignKey: 'fk_checkout',
    sourceKey: 'id',
    onDelete: 'CASCADE'
})

Keranjang.belongsTo(Checkout, {
    foreignKey: 'fk_checkout',
    targetKey: 'id',
    onDelete: 'SET NULL'
})

export { 
    Foto_Profil,
    User,
    Kategori,
    Kategori_Produk,
    Produk,
    Foto_Produk,
    Supplier,
    Riwayat_Supplier,
    Keranjang,
    Checkout,
    Payment,
    Foto_Payment,
    Favorit,
    Alamat_Penerima,
    Kupon
}