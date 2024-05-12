# Turbo::Mount

[![Gem Version](https://badge.fury.io/rb/turbo-mount.svg)](https://rubygems.org/gems/turbo-mount)

`Turbo::Mount` is a simple gem that allows you to add highly interactive components from React, Vue, Svelte, and other frameworks to your Hotwire application.

## Installation

Add the following line to your Gemfile:

```ruby
gem "turbo-mount"
```

For projects utilizing build tools such as [Vite](http://vite-ruby.netlify.app), also install `turbo-mount` package:

```bash
npm install turbo-mount
# or with yarn
yarn add turbo-mount
```

## Usage

### Initialization

To begin using `TurboMount`, start by initializing the library and registering the components you intend to use. Below are the steps to set up `TurboMount` with different configurations.

#### Standard Initialization

Import the necessary modules and initialize ```TurboMount``` with your application and the desired plugin. Here's how to set it up with a React plugin:

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

### Supported Frameworks

`TurboMount` supports the following frameworks:

- React `"turbo-mount/react"`
- Vue `"turbo-mount/vue"`
- Svelte `"turbo-mount/svelte"`

It's possible to add support for other frameworks by creating custom controller class extending `TurboMountController` and providing a plugin. See included plugins for examples.

### Custom Controllers

To customize component behavior or pass functions as props, create a custom controller:

```js
import { TurboMountReactController } from "turbo-mount"

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

Then pass this controller the register method:

```js
import SketchController from "controllers/turbo_mount/sketch_picker_controller"

turboMount.register('SketchPicker', SketchPicker, SketchController);
```

### Vite Integration

`TurboMount` includes a `registerComponents` function that automates the loading of components (requires `stimulus-vite-helpers` package). It also accepts an optional `controllers` property to autoload customized controllers:

```js
import { TurboMount } from "turbo-mount/react";
import { registerComponents } from "turbo-mount/vite";

const controllers = import.meta.glob("./**/*_controller.js", { eager: true });
const components = import.meta.glob(`/components/**/*.jsx`, { eager: true });

const turboMount = new TurboMount();
registerComponents({ turboMount, components, controllers });
```

The `registerComponents` helper searches for controllers in the following paths:
- `controllers/turbo-mount/${framework}/${controllerName}`
- `controllers/turbo-mount/${framework}-${controllerName}`
- `controllers/turbo-mount-${framework}-${controllerName}`
- `controllers/turbo-mount/${controllerName}`
- `controllers/turbo-mount-${controllerName}`

### Mount target

To specify a non-root mount target, use the `data-<%= controller_name %>-target="mount"` attribute:

```erb
<%= turbo_mount_react_component("SketchPicker", props: {color: "#430"}) do |controller_name| %>
  <h3>Color picker</h3>
  <div data-<%= controller_name %>-target="mount"></div>
<% end %>
```

## Development

After checking out the repo, run `bin/setup` to install dependencies. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/skryukov/turbo-mount.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
