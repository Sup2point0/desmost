ROOT = Pathname(__dir__).parent
SOURCE = ROOT / "desmost/src/magic/incantations"
TARGET = ROOT / "docs/writing/all-incantations.md"


def doc_incantations
   text = File.read(TARGET)

   ["global", "local", "expr"].each do |effect|
      glob = SOURCE / "#{effect}/*.ts"
      output = build_table(glob:)
      text.gsub!(//, output)
   end

   File.write(TAREGT, text)
end

def build_table(glob:)
   incantations = find_incantations_of(glob:)
   rows = incantations.map { |data| build_table_row(*data) }

   return "

| Incantation | Argument | Description |
| :---------- | :------- | :---------- |
#{rows.join("\n")}

   ".strip
end

def find_incantations_of(glob:)
   return glob
      .map { |path| File.read(path) }
      .map { |text| extract_incantation(text:) }
end

def extract_incantation(text:)
   ident = text.match(/(?<=identifier = )\w+/)&.first || "<ERROR>"

   accepts_arg = not text.match(/extends ArgIncantation/).nil?
   requires_arg = text.match(/(?<=requires_arg = )(true|false)/)&.first || "false"

   if accepts_arg
      if requires_arg == "true"
         arg = "required"
      else
         arg = "optional"
      end

      arg_type = text.match(/data\??: .+\)/)&.first || "?"
   else
      arg = "—"
      arg_type = "—"
   end

   return [ident, arg, arg_type doc]
end

def build_table_row(ident, arg, arg_type, doc)
   return "| [`/#{ident}`](##{ident}) | #{arg} | #{arg_type} | #{doc} |"
end
