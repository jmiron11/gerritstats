package com.holmsted.gerrit;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static com.google.common.base.Preconditions.checkNotNull;

public class CommandLineParser {

    private static final String DEFAULT_OUTPUT_DIR = "out";

    private String filename;
    private String serverName;
    private int serverPort;
    private String projectName;
    private String outputFile;
    private int limit = GerritStatReader.NO_COMMIT_LIMIT;
    @Nonnull
    private final List<String> excludedEmails = new ArrayList<>();
    @Nonnull
    private final List<String> includedBranches = new ArrayList<>();
    @Nonnull
    private final List<String> includedEmails = new ArrayList<>();
    @Nonnull
    private OutputType outputType = OutputType.HTML;

    private int commitPatchSetCountThreshold = 5;
    private Output output = Output.PER_PERSON_DATA;
    @Nonnull
    private String outputDir = DEFAULT_OUTPUT_DIR;

    public boolean parse(String[] args) {
        boolean hasSyntaxError = false;
        for (int i = 0; i < args.length; ++i) {
            String arg = args[i];
            boolean isNotAtEnd = (i < args.length - 1);
            if (arg.equals("--file") && isNotAtEnd) {
                filename = args[i + 1];
                ++i;
            } else if (arg.equals("--server") && isNotAtEnd) {
                serverName = args[i + 1];
                int portSeparator = serverName.indexOf(':');
                if (portSeparator != -1) {
                    serverPort = Integer.valueOf(serverName.substring(portSeparator + 1));
                    serverName = serverName.substring(0, portSeparator);
                }
                ++i;
            } else if (arg.equals("--project") && isNotAtEnd) {
                projectName = args[i + 1];
                ++i;
            } else if (arg.equals("--query-output-file") && isNotAtEnd) {
                outputFile = args[i + 1];
                ++i;
            } else if (arg.equals("--limit") && isNotAtEnd) {
                try {
                    limit = Integer.parseInt(args[i + 1]);
                    ++i;
                } catch (NumberFormatException nfe) {
                    hasSyntaxError = true;
                }
            } else if (arg.equals("--exclude") && isNotAtEnd) {
                String[] emails = args[i + 1].split(",");
                Collections.addAll(excludedEmails, emails);
                ++i;
            } else if (arg.equals("--include") && isNotAtEnd) {
                String[] emails = args[i + 1].split(",");
                Collections.addAll(includedEmails, emails);
                ++i;
            } else if (arg.equals("--branches") && isNotAtEnd) {
                String[] branches = args[i + 1].split(",");
                Collections.addAll(includedBranches, branches);
                ++i;
            } else if (arg.equals("--output-type") && isNotAtEnd) {
                outputType = OutputType.fromTypeString(args[i + 1]);
                ++i;
            } else if (arg.equals("--output") && isNotAtEnd) {
                output = checkNotNull(Output.fromString(args[i + 1]));
                ++i;
            } else if (arg.equals("--output-dir") && isNotAtEnd) {
                outputDir = resolveOutputDir(checkNotNull(args[i + 1]));
            } else if (arg.equals("--commit-patch-set-count-threshold") && isNotAtEnd) {
                commitPatchSetCountThreshold = Integer.parseInt(args[i + 1]);
                ++i;
            }
        }

        return (filename != null || serverName != null) && !hasSyntaxError;
    }

    @Nonnull
    private static String resolveOutputDir(@Nonnull String path) {
        if (path.startsWith("~" + File.separator)) {
            path = System.getProperty("user.home") + path.substring(1);
        }
        return path;
    }

    @Nullable
    public String getFilename() {
        return filename;
    }

    @Nullable
    public String getOutputFile() {
        return outputFile;
    }

    @Nullable
    public String getServerName() {
        return serverName;
    }

    @Nullable
    public String getProjectName() {
        return projectName;
    }

    public int getServerPort() {
        return serverPort;
    }

    public int getCommitLimit() {
        return limit;
    }

    @Nonnull
    public List<String> getExcludedEmails() {
        return excludedEmails;
    }

    @Nonnull
    public List<String> getIncludedEmails() {
        return includedEmails;
    }

    @Nonnull
    public List<String> getIncludeBranches() {
        return includedBranches;
    }

    @Nonnull
    public OutputType getOutputType() {
        return outputType;
    }

    @Nonnull
    public Output getOutput() {
        return output;
    }

    @Nonnull
    public String getOutputDir() {
        return outputDir;
    }

    public int getCommitPatchSetCountThreshold() {
        return commitPatchSetCountThreshold;
    }
}
