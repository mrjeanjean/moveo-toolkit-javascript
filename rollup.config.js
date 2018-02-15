import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import atImport from 'postcss-import';

export default [{
    input: 'src/index.js',
    output: [
        {
            file: "dist/moveo-toolkit.js",
            format: 'umd',
            name: 'MoveoToolkit'
        }
    ],
    plugins: [
        postcss({
            extract: true,
            plugins: [
                atImport()
            ]
        }),
        babel({
            exclude: ['node_modules/**']
        })
    ]
},
    {
        input: 'src/index.js',
        output: [
            {
                file: "dist/moveo-toolkit.esm.js",
                format: 'es'
            },
            {
                file: 'dist/moveo-toolkit.cjs.js',
                format: 'cjs'
            }
        ],
        plugins: [
            postcss({
                extract: false,
                inject: false
            }),
            babel({
                exclude: ['node_modules/**']
            })
        ]
    }
]
