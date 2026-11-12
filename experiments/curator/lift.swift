// Lifts the foreground (people, pets) out of a photo with macOS Vision, the
// same model as "Lift subject" in Photos, and writes a PNG with transparency.
// Usage: swift lift.swift <in.jpg> <out.png>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3, let image = NSImage(contentsOfFile: args[1]),
  let cg = image.cgImage(forProposedRect: nil, context: nil, hints: nil)
else {
  FileHandle.standardError.write("usage: lift <in> <out.png>\n".data(using: .utf8)!)
  exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([request])
guard let result = request.results?.first else {
  FileHandle.standardError.write("no subject found\n".data(using: .utf8)!)
  exit(2)
}
let buffer = try result.generateMaskedImage(
  ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let ci = CIImage(cvPixelBuffer: buffer)
let context = CIContext()
guard let out = context.createCGImage(ci, from: ci.extent) else { exit(3) }
let rep = NSBitmapImageRep(cgImage: out)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
print("instances: \(result.allInstances.count)")
