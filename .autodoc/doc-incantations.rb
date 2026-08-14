require "pathname"


ROOT = Pathname(__dir__).parent
SOURCE = ROOT / "desmost/src/magic"
TARGET = ROOT / "docs/writing/incantations.md"


def main()

   text = File.read(TARGET)

   ["global", "local", "expr"].each do |effect|
      glob = SOURCE.glob("#{effect}/*.ts")
      output = build_table(glob:)
      text.gsub!(/(?<=<!-- autodoc\? #{effect} -->\n).*?(?=\n<!-- autodoc\. -->)/mi, output)
   end

   File.write(TARGET, text)
end


def build_table(glob:)

   rows = glob
      .map { |path| File.read(path) }
      .map { |text| extract_incantation(text:) }
      .filter { |data| not data.nil? }
      .map { |data| build_table_row(*data) }

   return "
<table>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  #{rows.join("\n")}
</table>
   ".strip
end


def extract_incantation(text:)

   ident = text.match(/identifier += "([\w-]+)"/)&.[](1)
   if ident.nil? then return nil end
      
   ident_alt = text.match(/alias += "([\w-]+)"/)&.[](1)

   accepts_arg = (not text.match(/extends ArgIncantation/).nil?)
   requires_arg = text.match(/requires_arg += (true|false)/)&.[](1) || "false"

   if accepts_arg
      if requires_arg == "true"
         arg = "required"
      else
         arg = "optional"
      end

      arg_type = text.match(/interface \w+\s*(\{.*?\})\n\n/m)&.[](1)
      arg_type ||= text.match(/data\??: (.*?),?\s?\):?\s/)&.[](1)
      if arg_type.nil?
         arg_type = "?"
      else
         arg_type.gsub!(/\|/, "\\|")
         arg_type.gsub!(/\n/, "<br>")
         arg_type.gsub!(/: +/, ": ")
         if arg_type.include?("{")
            arg_type = "<pre lang=\"ts\"><code>#{arg_type}</code></pre>"
         else
            arg_type = "<code>#{arg_type}</code>"
         end
      end
   else
      arg = "—"
      arg_type = "—"
   end

   desc = text.match(/description\s*= "(.*?)"$/m)&.[](1) || ""

   return [ident, ident_alt, arg, arg_type, desc]
end


def build_table_row(ident, ident_alt, arg, arg_type, desc)

   ident_link = "[`/#{ident}`](##{ident})"
   ident_alt_link = ident_alt.nil? ? "" : "<br>[`/#{ident_alt}`](##{ident})"
   
   return "
  <tr></tr>
  <tr>
    <td>

#{ident_link}#{ident_alt_link}
    </td>
    <td>#{arg}</td>
    <td>#{arg_type}</td>
    <td>#{desc}</td>
  </tr>
   ".strip
end


main
