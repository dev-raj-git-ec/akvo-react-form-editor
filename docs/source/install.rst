Getting Started
---------------

Survey Editor for generating `akvo-react form <https://github.com/akvo/akvo-react-form>`__ survey definition

*******
Install
*******

Using NPM
=========

.. code:: bash

   npm install --save akvo-react-form-editor

Using Yarn
==========

.. code:: bash

   yarn add akvo-react-form-editor

*****
Usage
*****

.. code-block:: jsx

   import React from 'react'
   import 'akvo-react-form-editor/dist/index.css' /* REQUIRED */
   import WebformEditor from 'akvo-react-form-editor'

   class Example extends Component {
     render() {
       return <WebformEditor />
     }
   }
