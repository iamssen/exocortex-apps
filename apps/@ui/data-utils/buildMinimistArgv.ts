/**
 * Splits the input text into arguments, merging segments inside double quotes into a single argument.
 * Trims excess whitespace and handles standard shell-like quoting.
 * Example: '--category "car insurance"' => ['--category', 'car insurance']
 */
export function buildMinimistArgv(filterText: string): string[] {
  // Normalize whitespace: replace multiple spaces with a single space and trim
  const normalized = filterText.replaceAll(/\s+/g, ' ').trim();
  const argv = normalized.split(' ');

  const result: string[] = [];
  let inQuotes = false;
  let quoted: string[] = [];
  for (const arg of argv) {
    // Start of a quoted argument (does not end with a quote)
    if (!inQuotes && arg.startsWith('"') && !arg.endsWith('"')) {
      inQuotes = true;
      quoted = [arg.slice(1)];
    }
    // End of a quoted argument
    else if (inQuotes && arg.endsWith('"')) {
      quoted.push(arg.slice(0, -1));
      result.push(quoted.join(' '));
      inQuotes = false;
    }
    // Middle of a quoted argument
    else if (inQuotes) {
      quoted.push(arg);
    }
    // Standalone quoted argument (starts and ends with quote)
    else if (arg.startsWith('"') && arg.endsWith('"') && arg.length > 1) {
      result.push(arg.slice(1, -1));
    }
    // Regular argument (not quoted)
    else {
      result.push(arg);
    }
  }
  // If there was an open quote without a closing quote, join what was collected
  if (inQuotes && quoted.length > 0) {
    result.push(quoted.join(' '));
  }
  return result;
}
