require "pathname"


ROOT = Pathname(__dir__).parent
SOURCE = ROOT / "desmost/src/options.ts"
TARGET = ROOT / "docs/compiling/compiler-options.md"


def main()
	output = build_table(source: File.read(SOURCE))
	text = File.read(TARGET)
	text.gsub!(/(?<=<!-- autodoc\? -->\n).*?(?=\n<!-- autodoc\. -->)/m, output)
	File.write(TARGET, text)
end

def build_table(source:)
	contents = source.match(/(?<=interface DesmostOptions\n\{).+(?=\n\}\n\n)/m)[0].strip
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
	doc, src = text.strip.split(/\*\/\n\s+/)
	ident, type = src.split(": ")

	case type
		when "boolean" then values = ["true", "false"]
		else values = type.split(" | ")
	end

	# remove comment structure
	doc.gsub!(/\t\s+\* ?/, "")
	doc.sub!("/**", "")
	doc.strip!
	doc.gsub!("\n", "<br>")

	# puts "'#{doc}'"

	# extract default
	default = doc.match(/(?<=Defaults to ).*?\./)&.[](0)
	default ||= doc.match(/(?<=- ).+(?=\(default\))/)&.[](0)&.strip
	default ||= "–"
	if default.end_with?("`.")
		default.chop!
	end
	
	doc.gsub!(/((<br>){2})?Defaults to .*?\./, "")

	return [ident, values, default, doc]
end

def build_table_row(ident, values, default, doc)
	values = values.map { |v| "`#{v}`" }.join(" ")
	doc.gsub!(/\n\n/, "<br><br>")

	return "| **#{ident}** | #{values} | #{default} | #{doc} |"
end


main
