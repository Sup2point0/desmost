require "pathname"


ROOT = Pathname(__dir__).parent
SOURCE = ROOT / "desmost/src/options.ts"
TARGET = ROOT / "docs/compiling/compiler-options.md"


def main()
	source = File.read(SOURCE)

	contents = source.match(/(?<=interface DesmostOptions\n\{).+(?=\n\}\n$)/m)[0].strip
	fields = contents.split("\n\n").map { |text| extract_field(text:) }
	table = build_table(fields:)
	details = build_details(fields:)

	text = File.read(TARGET)
	text.gsub!(/(?<=<!-- autodoc\? \(1\) -->\n).*?(?=\n<!-- autodoc\. \(1\) -->)/m, table)
	text.gsub!(/(?<=<!-- autodoc\? \(2\) -->\n).*?(?=\n<!-- autodoc\. \(2\) -->)/m, details)

	File.write(TARGET, text)
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

	# extract default
	default = doc.match(/(?<=Defaults to ).*?\./)&.[](0)
	default ||= doc.match(/(?<=- ).+(?=\(default\))/)&.[](0)&.strip
	default ||= "–"
	if default.end_with?("`.")
		default.chop!
	end
	
	doc.gsub!(/(\n{2})?Defaults to .*?\./, "")

	return [ident, values, default, doc]
end


def build_table(fields:)
	rows = fields.map { |field| build_table_row(*field) }

	return "

| Option | Values | Default | Description |
| :----- | :----- | :------ | :---------- |
#{rows.join("\n")}

	".strip
end

def build_table_row(ident, values, default, doc)
	values = values.map { |v| "`#{v}`" }.join(" ")
	default = default.sub(/`[^`]*$/, "`")  # FIXME
	doc = doc[0..doc.index("\n")].rstrip

	return "| [#{ident}](##{ident}) | #{values} | #{default} | #{doc} |"
end


def build_details(fields:)
	out = ""

	fields.each do |field|
		ident, values, default, doc = field
		values = values.map { |v| "`#{v}`" }.join(" ")

		out += """
## `#{ident}`

<table>
  <tr>
    <th> Values </th>
	 <td> #{values} </td>
  </tr>
  <tr>
    <th> Default </th>
	 <th> #{default} </th>
  </tr>
</table>

#{doc}

<br>

"""
	end

	return out
end


main
