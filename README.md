# Turbo::Mount

[![Gem Version](https://badge.fury.io/rb/turbo-mount.svg)](https://rubygems.org/gems/turbo-mount)

`Turbo::Mount` is a simple gem that allows you to add highly interactive components from React, Vue, Svelte, and other frameworks to your Hotwire application.

## Installation

Install the gem and add to the application's Gemfile by executing:

    $ bundle add turbo-mount

If bundler is not being used to manage dependencies, install the gem by executing:

    $ gem install turbo-mount

## Usage

First, you need to initialize `TurboMount` and register the components you want to use:

```js
import { Application } from "@hotwired/stimulus"
import { TurboMount } from "turbo-mount"

const application = Application.start()

// Initialize TurboMount and register the react stimulus controller
const turboMount = new TurboMount({application, framework: "react"});

// Register the components you want to use
import { SketchPicker } from 'react-color'
turboMount.register('SketchPicker', SketchPicker);
```

Now you can use view helpers to mount the components:

```erb
<%= turbo_mount_component("SketchPicker", framework: "react", props: {color: "#034"}) %>

<%# or using alias %>

<%= turbo_mount_react_component("SketchPicker", props: {color: "#430"}) %>
```

In case you need to customize the component's behavior, or pass functions as props, you can create a custom controller:

```js
// javascript/controllers/turbo_mount_react_sketch_picker_controller.js

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

## Development

After checking out the repo, run `bin/setup` to install dependencies. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/skryukov/turbo-mount.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
