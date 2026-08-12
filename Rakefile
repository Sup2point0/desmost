task default: :doc


task :doc do
   require "pathname"
   main()
end


def main()
   root = Pathname(__dir__)

   source = File.read(root / "desmost/src/compiler/options.ts")
   output = build_table(source:)

   text = File.read(root / "docs/compiling/compiler-options.md")
   text.gsub!(/(?<=<!-- autodoc\? -->\n).*?(?=\n<!-- autodoc\. -->)/s, output)
   File.write(root / "docs/compiling/compiler-options.md", text)

   puts "done!"
end

def build_table(source:)
   contents = source.match(/(?<=interface DesmostOptions\n\{).+(?=\n\}\n\n)/ms)[0].strip
   fields = contents.split("\n\n")

   data = fields.map { |text| extract_field(text:) }
   rows = data.map { |data| build_table_row(*data) }

   return "

| Option | Values | Default | Description |
| :----- | :----- | :------ | :---------- |
#{rows.join("\n")}

   ".strip
end

def extract_field(text:)
   doc, src = text.strip.split(/\*\/\n +/)
   ident, type = src.split("?: ")

   case type
      when "boolean" then values = ["true", "false"]
      else values = type.split(" | ")
   end

   # extract default
   default = doc.match(/(?<=Defaults to ).*?\./)&.[](0)
   default ||= doc.match(/(?<=- ).+(?=\(default\))/)&.[](0)&.strip
   default ||= "–"
   doc.gsub!(/Defaults to .*?\./, "")

   # remove comment structure
   doc.gsub!(/ +\* ?/, "")
   doc.gsub!("/**", "")
   doc.strip!
   doc.gsub!("\n", "<br>")

   return [ident, values, default, doc]
end

def build_table_row(ident, values, default, doc)
   ident.chop!
   values = values.map { |v| "`#{v}`" }.join(" ")
   doc.gsub!(/\n\n/, "<br><br>")

   return "| **#{ident}** | #{values} | #{default} | #{doc} |"
end
