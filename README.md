# Turbo::Mount

[![Gem Version](https://badge.fury.io/rb/turbo-mount.svg)](https://rubygems.org/gems/turbo-mount)

`Turbo::Mount` is a simple gem that allows you to add highly interactive components from React, Vue, Svelte, and other frameworks to your Hotwire application.

## Installation

Install the gem and add to the application's Gemfile by executing:

    $ bundle add turbo-mount

If bundler is not being used to manage dependencies, install the gem by executing:

    $ gem install turbo-mount

## Usage

### Initialization

First, initialize `TurboMount` and register the components you wish to use:

```js
import { Application } from "@hotwired/stimulus"
import { TurboMount } from "turbo-mount"
import plugin from "turbo-mount/react"
import { SketchPicker } from 'react-color'

const application = Application.start();
const turboMount = new TurboMount({application, plugin});

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

`TurboMount` includes a `registerComponents` function that automates the loading of components. It also accepts an optional `controllers` property to autoload customized controllers:

```js
import { application } from "./application"
import { registerControllers } from "stimulus-vite-helpers";
import { TurboMount } from "turbo-mount";
import { registerComponents } from "turbo-mount/vite";
import plugin from "turbo-mount/react";

const controllers = import.meta.glob("./**/*_controller.js", { eager: true });
const components = import.meta.glob(`/components/**/*.jsx`, {eager: true});

registerControllers(application, controllers);

const turboMount = new TurboMount({application, plugin});
registerComponents({turboMount, components, controllers});
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
