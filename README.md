# Turbo Mount

[![Gem Version](https://badge.fury.io/rb/turbo-mount.svg)](https://rubygems.org/gems/turbo-mount)

`TurboMount` is a simple library that allows you to add highly interactive components from React, Vue, Svelte, and other frameworks to your Hotwire application.

## Table of Contents
- [Installation](#installation)
  - [Importmaps](#importmaps)
- [Usage](#usage)
  - [Initialization](#initialization)
    - [Standard Initialization](#standard-initialization)
    - [Simplified Initialization](#simplified-initialization)
    - [Plugin-Specific Initialization](#plugin-specific-initialization)
  - [View Helpers](#view-helpers)
  - [Supported Frameworks](#supported-frameworks)
  - [Custom Controllers](#custom-controllers)
  - [Vite Integration](#vite-integration)
  - [Mount Target](#mount-target)
- [License](#license)

<a href="https://evilmartians.com/?utm_source=turbo-mount&utm_campaign=project_page">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Built by Evil Martians" width="236" height="54">
</a>

## Installation

To install Turbo Mount, add the following line to your `Gemfile` and run `bundle install`:

```ruby
gem "turbo-mount"
```

### Automatic Installation

Run the following command to install the necessary files:

```bash
bin/rails generate turbo_mount:install
```

This will add `turbo-mount` package and framework dependencies to your `package.json` or `importmap.rb`, and create the Turbo Mount initialization file.

### Manual Installation

You can also install the necessary JavaScript files manually.

If your project utilizes build tools such as [Vite](http://vite-ruby.netlify.app), also install the `turbo-mount` package:

```bash
npm install turbo-mount
# or with yarn
yarn add turbo-mount

# and the desired framework
npm install react react-dom
# or
npm install vue
# or
npm install svelte
```

If you're using Vite, don't forget to add [framework-specific plugins](https://vitejs.dev/plugins) to your `vite.config.js`.

### Importmaps
To use `TurboMount` with importmaps, you need to pin the necessary JavaScript files in your `config/importmap.rb`:

```ruby
pin "turbo-mount", to: "turbo-mount.min.js"
pin "turbo-mount/react", to: "turbo-mount/react.min.js"
```

This ensures that `turbo-mount` and its plugins are available in your application.

Also pin the desired framework:

```bash
bin/importmap pin react react-dom react-dom/client
# or
bin/importmap pin vue
# or
bin/importmap pin svelte
```

Note: Importmap-only mode is quite limited in terms of JavaScript dependencies. If you're using a more complex setup, consider using a bundler like Vite.

## Usage

### Initialization

To begin using `TurboMount`, start by initializing the library and registering the components you intend to use. Below are the steps to set up `TurboMount` with different configurations.

#### Standard Initialization

Import the necessary modules and initialize `TurboMount` with your application and the desired plugin. Here's how to set it up with a React plugin:

```js
import { Application } from "@hotwired/stimulus";
import { TurboMount } from "turbo-mount";
import plugin from "turbo-mount/react";
import { SketchPicker } from 'react-color';

const application = Application.start();
const turboMount = new TurboMount({ application, plugin });

turboMount.register('SketchPicker', SketchPicker);
```

#### Simplified Initialization

If you prefer not to specify the `application` explicitly, `TurboMount` can automatically detect or initialize it. This approach uses the `window.Stimulus` if available; otherwise, it initializes a new Stimulus application:

```js
import { TurboMount } from "turbo-mount";
import plugin from "turbo-mount/react";
import { SketchPicker } from 'react-color';

const turboMount = new TurboMount({ plugin });

turboMount.register('SketchPicker', SketchPicker);
```

#### Plugin-Specific Initialization

For a more streamlined setup, you can directly import a specialized version of `TurboMount`:

```js
import { TurboMountReact } from "turbo-mount/react";
import { SketchPicker } from 'react-color';

const turboMount = new TurboMountReact();

turboMount.register('SketchPicker', SketchPicker);
```

### View Helpers

Use the following helpers to mount components in your views:

```erb
<%= turbo_mount_component("SketchPicker", framework: "react", props: {color: "#034"}) %>

<%# or using alias %>

<%= turbo_mount_react_component("SketchPicker", props: {color: "#430"}) %>
```

This will generate the following HTML:

```html
<div data-controller="turbo-mount-react-sketch-picker"
     data-turbo-mount-react-sketch-picker-component-value="SketchPicker"
     data-turbo-mount-react-sketch-picker-props-value="{&quot;color&quot;:&quot;#034&quot;}">
</div>
```

### Supported Frameworks

`TurboMount` supports the following frameworks:

- React: `"turbo-mount/react"`
- Vue: `"turbo-mount/vue"`
- Svelte: `"turbo-mount/svelte"`

To add support for other frameworks, create a custom controller class extending `TurboMountController` and provide a plugin. See included plugins for examples.

### Custom Controllers

To customize component behavior or pass functions as props, create a custom controller:

```js
import { TurboMountReactController } from "turbo-mount";

export default class extends TurboMountReactController {
  get componentProps() {
    return {
      ...this.propsValue,
      onChange: this.onChange,
    };
  }

  onChange = (color) => {
    this.propsValue = { ...this.propsValue, color: color.hex };
  };
}
```

Then pass this controller to the register method:

```js
import SketchController from "controllers/turbo_mount/sketch_picker_controller";

turboMount.register('SketchPicker', SketchPicker, SketchController);
```

### Vite Integration

`TurboMount` includes a `registerComponents` function that automates the loading of components (requires the `stimulus-vite-helpers` package). It also accepts an optional `controllers` property to autoload customized controllers:

```js
import { TurboMount } from "turbo-mount/react";
import { registerComponents } from "turbo-mount/vite";

const controllers = import.meta.glob("./**/*_controller.js", { eager: true });
const components = import.meta.glob("/components/**/*.jsx", { eager: true });

const turboMount = new TurboMount();
registerComponents({ turboMount, components, controllers });
```

The `registerComponents` helper searches for controllers in the following paths:
- `controllers/turbo-mount/${framework}/${controllerName}`
- `controllers/turbo-mount/${framework}-${controllerName}`
- `controllers/turbo-mount-${framework}-${controllerName}`
- `controllers/turbo-mount/${controllerName}`
- `controllers/turbo-mount-${controllerName}`

### Mount Target

To specify a non-root mount target, use the `data-<%= controller_name %>-target="mount"` attribute:

```erb
<%= turbo_mount_react_component("SketchPicker", props: {color: "#430"}) do |controller_name| %>
  <h3>Color picker</h3>
  <div data-<%= controller_name %>-target="mount"></div>
<% end %>
```

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
